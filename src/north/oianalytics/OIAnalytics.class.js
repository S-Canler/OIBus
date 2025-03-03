const fs = require('fs')

const ApiHandler = require('../ApiHandler.class')

/**
 * Class OIAnalytics - sends files through a POST Multipart HTTP
 */
class OIAnalytics extends ApiHandler {
  static category = 'OI'

  /**
   * Constructor for OIAnalytics
   * @constructor
   * @param {Object} applicationParameters - The application parameters
   * @param {Engine} engine - The Engine
   * @return {void}
   */
  constructor(applicationParameters, engine) {
    super(applicationParameters, engine)

    const valuesEndpoint = '/api/oianalytics/oibus/data/time_values'
    const fileEndpoint = '/api/oianalytics/data/values/upload'
    const queryParam = `?dataSourceId=${this.application.name}`

    const { host, authentication, proxy = null } = applicationParameters.OIAnalytics

    this.valuesUrl = `${host}${valuesEndpoint}${queryParam}`
    this.fileUrl = `${host}${fileEndpoint}${queryParam}`
    this.authentication = authentication
    this.proxy = this.getProxy(proxy)

    this.canHandleValues = true
    this.canHandleFiles = true
  }

  /**
   * Handle messages by sending them to another OIBus
   * @param {object[]} values - The values
   * @return {Promise} - The handle status
   */
  async handleValues(values) {
    this.logger.silly(`OIAnalytics handleValues() with ${values.length} values`)

    const cleanedValues = values.map((value) => ({
      timestamp: value.timestamp,
      data: value.data,
      pointId: value.pointId,
    }))
    await this.postJson(cleanedValues)
    this.logger.silly(`OIAnalytics has posted ${cleanedValues.length} values`)
    this.statusData['Last handled values at'] = new Date().toISOString()
    this.statusData['Number of values sent since OIBus has started'] += values.length
    this.statusData['Last added point id (value)'] = `${values[values.length - 1].pointId} (${values[values.length - 1].data.value})`
    this.updateStatusDataStream()
    return values.length
  }

  /**
   * Handle the file.
   * @param {String} filePath - The path of the file
   * @return {Promise} - The send status
   */
  async handleFile(filePath) {
    const stats = fs.statSync(filePath)
    this.logger.silly(`OIAnalytics handleFile(${filePath}) (${stats.size} bytes)`)
    this.statusData['Last uploaded file'] = filePath
    this.statusData['Number of files sent since OIBus has started'] += 1
    this.statusData['Last upload at'] = new Date().toISOString()
    this.updateStatusDataStream()
    return this.postFile(filePath)
  }
}

module.exports = OIAnalytics
