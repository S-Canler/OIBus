const fs = require('fs')
const path = require('path')
const csv = require('papaparse')
const moment = require('moment-timezone')
const ProtocolHandler = require('../ProtocolHandler.class')

/**
 * Class RestApi
 */
class RestApi extends ProtocolHandler {
  /**
   * Constructor for RestApi
   * @constructor
   * @param {Object} dataSource - The data source
   * @param {Engine} engine - The engine
   * @return {void}
   */
  constructor(dataSource, engine) {
    super(dataSource, engine)

    const {
      apiType,
      host,
      port,
      entity,
      authentication,
      connectionTimeout,
      requestTimeout,
      startDate,
    } = this.dataSource.RestApi

    this.apiType = apiType
    this.host = host
    this.port = port
    this.entity = entity
    this.authentication = authentication
    this.connectionTimeout = connectionTimeout
    this.requestTimeout = requestTimeout
    this.startDate = startDate // "startDate" is currently a "hidden" parameter of oibus.json

    const { engineConfig: { caching: { cacheFolder } } } = this.engine.configService.getConfig()
    this.tmpFolder = path.resolve(cacheFolder, this.dataSource.dataSourceId)

    // Create tmp folder if not exists
    if (!fs.existsSync(this.tmpFolder)) {
      fs.mkdirSync(this.tmpFolder, { recursive: true })
    }

    this.handlesPoints = true
    this.handlesFile = true
  }

  async connect() {
    await super.connect()
    this.lastCompletedAt = await this.getConfig('lastCompletedAt')
    if (!this.lastCompletedAt) {
      this.lastCompletedAt = this.startDate ? new Date(this.startDate).toISOString() : new Date().toISOString()
    }
  }

  /**
   * Get entries from the database since the last query completion, write them into a CSV file and send to the Engine.
   * @param {*} _scanMode - The scan mode
   * @return {void}
   */
  async onScanImplementation(_scanMode) {
    let result = []
    try {
      switch (this.apiType) {
        case 'octopus':
          result = await this.getDataFromOctopus()
          break
        default:
          this.logger.error(`Api type ${this.apiType} not supported by ${this.dataSource.dataSourceId}`)
          result = []
      }
    } catch (error) {
      this.logger.error(error)
    }

    this.logger.debug(`Found ${result.length} results`)

    if (result.length > 0) {
      this.lastCompletedAt = this.setLastCompletedAt(result)
      await this.setConfig('lastCompletedAt', this.lastCompletedAt)
      const csvContent = await this.generateCSV(result)
      if (csvContent) {
        const filename = this.filename.replace('@date', moment().format('YYYY_MM_DD_HH_mm_ss'))
        const filePath = path.join(this.tmpFolder, filename)
        try {
          this.logger.debug(`Writing CSV file at ${filePath}`)
          fs.writeFileSync(filePath, csvContent)

          if (this.compression) {
            // Compress and send the compressed file
            const gzipPath = `${filePath}.gz`
            await this.compress(filePath, gzipPath)

            fs.unlink(filePath, (unlinkError) => {
              if (unlinkError) {
                this.logger.error(unlinkError)
              } else {
                this.logger.info(`File ${filePath} compressed and deleted`)
              }
            })

            this.logger.debug(`Sending compressed ${gzipPath} to Engine.`)
            this.addFile(gzipPath, this.preserveFiles)
          } else {
            this.logger.debug(`Sending ${filePath} to Engine.`)
            this.addFile(filePath, this.preserveFiles)
          }
        } catch (error) {
          this.logger.error(error)
        }
      }
    }
  }

  /**
   * Get new entries from MSSQL database.
   * @returns {void}
   */
  async getDataFromOctopus() {
    const data = { property: this.dataSource.points[0].pointId }
    this.logger.silly(`Requesting point ${JSON.stringify(data)}`)
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    return this.engine.requestService.httpSend(`${this.host}:${this.port}/Thingworx/Things/${this.entity}/Services/ODAgetPropertyValues`,
      'POST',
      this.authentication,
      null,
      JSON.stringify(data),
      headers)
  }

  /**
   * Format date taking into account the timezone configuration.
   * Since we don't know how the date is actually stored in the database, we read it as UTC time
   * and format it as it would be in the configured timezone.
   * Ex: With timezone "Europe/Paris" the date "2019-01-01 00:00:00" will be converted to "Tue Jan 01 2019 00:00:00 GMT+0100"
   * @param {Date} date - The date to format
   * @param {String} timezone - The timezone to use to replace the timezone of the date
   * @param {String} dateFormat - The format of the date to use for the return result
   * @returns {string} - The formatted date with timezone
   */
  static formatDateWithTimezone(date, timezone, dateFormat) {
    const timestampWithoutTZAsString = moment.utc(date).format('YYYY-MM-DD HH:mm:ss.SSS')
    return moment.tz(timestampWithoutTZAsString, timezone).format(dateFormat)
  }

  /**
   * Generate CSV file from the values.
   * @param {object[]} result - The query result
   * @returns {Promise<string>} - The CSV content
   */
  generateCSV(result) {
    // loop through each value and format date to timezone if value is Date
    result.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const value = row[key]
        if (value instanceof Date) {
          row[key] = RestApi.formatDateWithTimezone(value, this.timezone, this.dateFormat)
        }
      })
    })
    const options = {
      header: true,
      delimiter: this.delimiter,
    }
    return csv.unparse(result, options)
  }
}

module.exports = RestApi
