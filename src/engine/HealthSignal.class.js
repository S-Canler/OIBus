const Logger = require('./Logger.class')

/**
 * Class HealthSignal - sends health signal to a remote host
 */
class HealthSignal {
  /**
   * Constructor for HealthSignal
   * @constructor
   * @param {Engine} engine - The Engine
   * @return {void}
   */
  constructor(engine) {
    this.engine = engine
    this.logger = Logger.getDefaultLogger()
    const { engineConfig } = this.engine.configService.getConfig()

    const { http, logging } = engineConfig.healthSignal

    this.logging = logging

    this.http = http
    this.http.proxy = Array.isArray(engineConfig.proxies) && engineConfig.proxies.find(({ name }) => name === this.http.proxy)
    this.httpTimer = null
    this.loggingTimer = null
    this.engineName = engineConfig.engineName
  }

  /**
   * Start the timer for sending health signal.
   * @return {void}
   */
  start() {
    if (this.http.enabled) {
      this.logger.info('Initializing http health signal')
      this.httpTimer = setTimeout(this.sendHttpSignal.bind(this), this.http.frequency * 1000)
    }
    if (this.logging.enabled) {
      this.logger.info('Initializing logging health signal')
      this.loggingTimer = setTimeout(this.sendLoggingSignal.bind(this), this.logging.frequency * 1000)
    }
  }

  /**
   * Stop the timers for sending health signal.
   * @return {void}
   */
  stop() {
    if (this.httpTimer) {
      clearTimeout(this.httpTimer)
    }
    if (this.loggingTimer) {
      clearTimeout(this.loggingTimer)
    }
  }

  /**
   * Callback to send the health signal with http.
   * @return {Promise<void>} - The response
   */
  async sendHttpSignal() {
    this.logger.silly('sendHttpSignal')

    const healthStatus = await this.prepareStatus(this.http.verbose)
    healthStatus.id = this.engineName
    try {
      const data = JSON.stringify(healthStatus)
      const headers = { 'Content-Type': 'application/json' }
      await this.engine.requestService.httpSend(
        `${this.http.host}${this.http.endpoint}`,
        'POST',
        this.http.authentication,
        this.http.proxy,
        data,
        headers,
      )
      this.logger.debug('Health signal successful')
    } catch (error) {
      this.logger.error(`sendRequest error status: ${error}`)
    }

    this.httpTimer = setTimeout(this.sendHttpSignal.bind(this), this.http.frequency * 1000)
  }

  /**
   * Callback to send the health signal with logger.
   * @returns {void}
   */
  async sendLoggingSignal() {
    this.logger.silly('sendHttpSignal')

    const healthStatus = await this.prepareStatus(true)
    this.logger.info(JSON.stringify(healthStatus))
    this.loggingTimer = setTimeout(this.sendLoggingSignal.bind(this), this.logging.frequency * 1000)
  }

  /**
   * Retrieve status information from the engine
   * @param {boolean} verbose - return only the id when false, return full status when true
   * @returns {object} - the status of oibus
   */
  async prepareStatus(verbose) {
    let status = { version: this.engine.getVersion() }
    if (verbose) {
      status = await this.engine.getStatus()
    }
    return status
  }

  /**
   * Forward an healthSignal request.
   * @param {object} data - The content to forward
   * @return {Promise<void>} - The response
   */
  async forwardRequest(data) {
    if (this.http.enabled) {
      this.logger.debug('Forwarding healthSignal request')
      const stringData = JSON.stringify(data)
      const headers = { 'Content-Type': 'application/json' }
      await this.engine.requestService.httpSend(this.http.host, 'POST', this.http.authentication, this.http.proxy, stringData, headers)
      this.logger.debug('Forwarding healthSignal was successful')
    }
  }
}

module.exports = HealthSignal
