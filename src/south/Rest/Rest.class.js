const http = require('http')

const ProtocolHandler = require('../ProtocolHandler.class')

class Rest extends ProtocolHandler {
  /**
   * Constructor for Rest
   * @constructor
   * @param {Object} dataSource - The data source
   * @param {Engine} engine - The engine
   * @return {void}
   */
  constructor(dataSource, engine) {
    super(dataSource, engine)
    const { portNumber } = this.dataSource.Rest
    this.portNumber = portNumber
  }

  /**
   * Initiate connection and start listening.
   * @return {void}
   */
  async connect() {
    await super.connect()

    const options = {
      maxHeaderSize: 16384,
      /*
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
      */
    }

    http.createServer(options, this.incomingCall.bind(this)).listen(this.portNumber)
  }

  /**
   * Handle incoming call
   * @param {object} req - req
   * @param {object} res - res
   * @return {void}
   */
  async incomingCall(req, res) {
    this.logger.debug(`eceived incoming call ${req.url}`)
    res.writeHead(200)
    res.end(`received ${req.url}`)
  }

  /**
   * Close the connection
   * @return {void}
   */
  disconnect() {
    this.app.close()
  }
}

module.exports = Rest
