const testConfig = {
  engine: {
    port: 2223,
    user: 'admin',
    password: '23423423',
    filter: ['127.0.0.1', '::1', '::ffff:127.0.0.1', '*'],
    safeMode: false,
    logParameters: {
      consoleLog: { level: 'debug' },
      fileLog: {
        level: 'error',
        fileName: './logs/journal.log',
        maxSize: 1000000,
        numberOfFiles: 5,
        tailable: true,
      },
      sqliteLog: {
        level: 'error',
        fileName: './logs/journal.db',
        maxSize: 50000000,
      },
      lokiLog: {
        level: 'debug',
        host: 'localhost:3100',
      },
    },
    caching: {
      cacheFolder: './cache',
      archive: {
        enabled: true,
        archiveFolder: "./cache/archive/",
        retentionDuration: 720
      },
   },
    historyQuery: { folder: './historyQuery' },
    scanModes: [
      { scanMode: 'everySecond', cronTime: '* * * * * *' },
      { scanMode: 'every10Second', cronTime: '* * * * * /10' },
      { scanMode: 'every1Min', cronTime: '* * * * *' },
      { scanMode: 'listen', cronTime: 'listen' },
    ],
    proxies: [
      {
        name: 'sss',
        protocol: '',
        host: 'hhh',
        port: 123,
        username: 'uuu',
        password: 'pppppppppp',
      },
      {
        name: 'ff',
        protocol: '',
        host: 'tt',
        port: 1,
        username: 'uii',
        password: 'ppppppppppppp',
      },
      {
        name: 'no-auth',
        protocol: '',
        host: 'tt',
        port: 1,
      },
    ],
    engineName: 'OIBus',
    healthSignal: {
      logging: {
        enabled: true,
        frequency: 3600,
      },
      http: {
        enabled: true,
        host: 'https://hostname',
        endpoint: '/api/optimistik/oibus/info',
        authentication: {
          type: 'Basic',
          username: 'username',
          password: 'password',
        },
        id: 'OIBus-test',
        frequency: 300,
        proxy: '',
      },
    },
    httpRequest: {
      stack: 'fetch',
      timeout: 30,
    },
    externalSources: ['any'],
  },
  south: {
    dataSources: [
      {
        dataSourceId: 'MQTTServer',
        protocol: 'MQTT',
        enabled: false,
        MQTT: {
          server: 'hostname',
          mqttProtocol: 'mqtt',
          username: 'bai',
          password: 'pppppppppppppppppppppp',
          url: 'mqtt://hostname:1883',
          timeStampOrigin: 'oibus',
          timeStampKey: 'timestamp',
          timeStampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
          timeStampTimezone: 'Europe/Paris',
        },
        points: [
          { pointId: '/fttest.base/Tank 5.tank/Sensor22.temperature', scanMode: 'listen', topic: 'temperatureTank1' },
          { pointId: '/fttest.base/Tank 6.tank/Sensor23.temperature', scanMode: 'listen', topic: 'temperatureTank2' },
        ],
      },
      {
        dataSourceId: 'SimulationServer',
        protocol: 'OPCUA_HA',
        enabled: false,
        OPCUA_HA: {
          opcuaPort: 53530,
          httpsPort: 53443,
          host: 'hostname',
          endPoint: 'Server/Simulation',
          timeOrigin: 'server',
          scanGroups: [
            { Aggregate: 'Raw', resampling: 'None', scanMode: 'everySecond' },
            { Aggregate: 'Raw', resampling: 'None', scanMode: 'everySecond' },
          ],
        },
        points: [
          { ns: 5, pointId: '/fttest.base/Tank 5.tank/333333.temperature', scanMode: 'everySecond', s: 'Counter1' },
          { ns: 5, pointId: '/fttest.base/Tank 5.tank/333333.temperature', scanMode: 'everyNoon', s: 'Random1' },
        ],
      },
      {
        dataSourceId: 'SimulationServerBis',
        protocol: 'OPCUA_HA',
        enabled: false,
        OPCUA_HA: {
          opcuaPort: 53530,
          httpsPort: 53443,
          host: 'hostname',
          endPoint: 'Server/Simulation',
          timeOrigin: 'server',
        },
        points: [
          { ns: 5, pointId: '/fttest.base/Tank 9.tank/333333.temperature', scanMode: 'everySecond', s: 'Sinusoid1' },
        ],
      },
      {
        dataSourceId: 'SimulationServerBis copy',
        protocol: 'OPCUA_HA',
        enabled: false,
        OPCUA_HA: {
          opcuaPort: 53530,
          httpsPort: 53443,
          host: 'hostname',
          endPoint: 'Server/Simulation',
          timeOrigin: 'server',
        },
        points: [
          { ns: 5, pointId: '/fttest.base/Tank 9.tank/333333.temperature', scanMode: 'everySecond', s: 'Sinusoid1' },
        ],
      },
      {
        dataSourceId: 'PLC-35',
        protocol: 'Modbus',
        enabled: false,
        Modbus: { port: 502, host: 'http://hostname' },
        points: [
          {
            pointId: '/fttest.base/Tank 3.tank/333333.fill_level',
            scanMode: 'everySecond',
            address: '0x0031',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222222.valve_state',
            scanMode: 'everyNoon',
            address: '0x0f8',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222222.fill_level',
            scanMode: 'everySecond',
            address: '0x76a0',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222333.fill_level',
            scanMode: 'everySecond',
            address: '0x76b0',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 3.tank/111111.valve_state',
            scanMode: 'everySecond',
            address: '0x83a6',
            type: 'boolean',
          },
        ],
      },
      {
        dataSourceId: 'PLC-42',
        protocol: 'Modbus',
        enabled: false,
        Modbus: { port: 502, host: 'http://hostname' },
        points: [
          {
            pointId: '/fttest.base/Tank4.tank/111111.fill_level',
            scanMode: 'everySecond',
            address: '0x0f',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank4.tank/111111.flow_rate',
            scanMode: 'everySecond',
            address: '0x20',
            type: 'boolean',
          },
        ],
      },
      {
        dataSourceId: 'FolderScanner',
        protocol: 'FolderScanner',
        enabled: true,
        FolderScanner: {
          preserveFiles: true,
          ignoreModifiedDate: false,
          minAge: 0,
          inputFolder: './input/',
          scanMode: 'every5Second',
          regex: '.csv',
          compression: false,
        },
        points: [],
        scanMode: 'every10Second',
      },
      {
        dataSourceId: 'SQLDbToFile',
        protocol: 'SQLDbToFile',
        enabled: false,
        SQLDbToFile: {
          port: 1433,
          password: 'popopopopopopopopo',
          connectionTimeout: 1000,
          requestTimeout: 1000,
          databasePath: './test.db',
          host: '192.168.0.11',
          driver: 'mssql',
          username: 'oibus_user',
          database: 'oibus',
          query:
            'SELECT created_at AS timestamp, value1 AS temperature FROM oibus_test WHERE created_at > @LastCompletedDate',
          delimiter: ',',
          filename: 'sql-@date.csv',
          scanMode: 'everySecond',
          timeColumn: 'timestamp',
          timezone: 'Europe/Paris',
          dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
          timeFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
          compression: false,
        },
        scanMode: 'every10Second',
        points: [],
      },
      {
        dataSourceId: 'OPC-HDA',
        protocol: 'OPCHDA',
        enabled: false,
        OPCHDA: {
          tcpPort: 3333,
          retryInterval: 10000,
          agentFilename: './deps/win/HdaAgent/HdaAgent.exe',
          logLevel: 'debug',
          host: 'opcserver',
          serverName: 'Matrikon.OPC.Simulation',
          maxReturnValues: 10000,
          maxReadInterval: 3600,
        },
        points: [
          { pointId: 'A13518/AI1/PV.CV', scanMode: 'everySecond' },
          { pointId: '_FC42404/PID1/OUT.CV', scanMode: 'everySecond' },
          { pointId: '_FC42404/PID1/PV.CV', scanMode: 'every10Second' },
        ],
        scanGroups: [
          { scanMode: 'everySecond', aggregate: '', resampling: 'Minute' },
          { scanMode: 'every10Second', aggregate: '', resampling: 'Minute' },
        ],
      },
      {
        dataSourceId: 'ADS - Test',
        protocol: 'ADS',
        enabled: true,
        ADS: {
          port: 851,
          netId: '10.211.55.3.1.1',
          clientAdsPort: 32750,
          routerTcpPort: 48898,
          clientAmsNetId: '10.211.55.2.1.1',
          routerAddress: '10.211.55.3',
          retryInterval: 10000,
          plcName: 'PLC_TEST.',
          boolAsText: 'Integer',
          enumAsText: 'Text',
          structureFiltering: [
            {
              name: 'ST_Example',
              fields: 'SomeReal,SomeDate',
            },
            {
              name: 'Tc2_Standard.TON',
              fields: '*',
            },
          ],
        },
        points: [
          {
            pointId: 'GVL_Test.TestENUM',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.TestINT',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.TestSTRING',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.ExampleSTRUCT',
            scanMode: 'everySecond',
          },
          {
            pointId: 'GVL_Test.TestARRAY',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.TestARRAY2',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.TestTimer',
            scanMode: 'every10Seconds',
          },
          {
            pointId: 'GVL_Test.TestBadType',
            scanMode: 'every1Hour',
          },
          {
            pointId: 'GVL_Test.TestByte',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestWord',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestDWord',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestSINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestUSINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestUINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestDINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestUDINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestLINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestULINT',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestTIME',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestTIME_OF_DAY',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestREAL',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestLREAL',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestDATE',
            scanMode: 'every3Hours',
          },
          {
            pointId: 'GVL_Test.TestDATE_AND_TIME',
            scanMode: 'every3Hours',
          },
        ],
      },
    ],
  },
  north: {
    applications: [
      {
        applicationId: 'c',
        api: 'Console',
        enabled: true,
        Console: {},
        caching: { sendInterval: 10000, retryInterval: 5000, groupCount: 1, maxSendCount: 10000 },
        subscribedTo: ['MQTTServer'],
      },
      {
        applicationId: 'monoiconnect',
        api: 'OIConnect',
        enabled: false,
        OIConnect: {
          authentication: { password: '', type: 'Basic', username: '' },
          timeout: 180000,
          host: 'http://hostname:2223',
          valuesEndpoint: '/addValues',
          fileEndpoint: '/addFile',
          proxy: '',
          stack: 'fetch',
        },
        caching: { sendInterval: 10000, retryInterval: 5000, groupCount: 1000, maxSendCount: 10000 },
        subscribedTo: [],
      },
      {
        applicationId: 'RawFileSender',
        enabled: false,
        api: 'OIAnalytics',
        caching: {
          sendInterval: 15000,
          retryInterval: 10000,
        },
        OIAnalytics: {
          host: 'https://hostname',
          endpoint: '/api/optimistik/data/values/upload',
          authentication: {
            type: 'Basic',
            username: 'anyuser',
            password: 'anypass',
          },
        },
        proxy: '',
        subscribedTo: [],
      },
      {
        applicationId: 'mqtt',
        api: 'MQTTNorth',
        enabled: true,
        MQTTNorth: {
          password: 'anypass',
          url: 'mqtt://hostname:1883',
          username: 'anyuser',
          qos: 1,
          regExp: '(.*)/',
          topic: '%1$s',
        },
        caching: {
          sendInterval: 10000,
          retryInterval: 5000,
          groupCount: 1000,
          maxSendCount: 10000,
        },
        subscribedTo: [],
      },
      {
        applicationId: 'Timescale',
        api: 'TimescaleDB',
        enabled: false,
        TimescaleDB: {
          password: 'anypass',
          user: 'anyuser',
          host: 'anyhost',
          db: 'anydb',
        },
        caching: {
          sendInterval: 10000,
          retryInterval: 5000,
          groupCount: 1000,
          maxSendCount: 10000,
        },
        subscribedTo: [],
      },
      {
        applicationId: 'WATSYConnect',
        api: 'WATSYConnect',
        enabled: false,
        WATSYConnect: {
          MQTTUrl: 'mqtt://hostname',
          port: 1883,
          username: 'anyuser',
          password: 'anypass',
          applicativeHostUrl: 'https://localhost.com', // Random path
          secretKey: 'anytoken',
        },
        caching: {
          sendInterval: 1000,
          retryInterval: 5000,
          groupCount: 10000,
          maxSendCount: 10000,
        },
        subscribedTo: [],
      },
      {
        applicationId: 'CsvToHttp',
        api: 'CsvToHttp',
        enabled: false,
        CsvToHttp: {
          applicativeHostUrl: 'https://localhost.com',
          requestMethod: 'POST',
          proxy: '',
          mapping: [
            {
              csvField: 'Id',
              httpField: 'Identification',
              type: 'integer',
            },
            {
              csvField: 'Begin',
              httpField: 'date',
              type: 'short date (yyyy-mm-dd)',
            },
          ],
          authentication: {
            type: 'API Key',
            secretKey: 'anytoken',
            key: 'anyvalue',
          },
          bodyMaxLength: 100,
          csvDelimiter: ';',
        },
        caching: {
          sendInterval: 1000,
          retryInterval: 5000,
          groupCount: 1000,
          maxSendCount: 10000,
        },
        subscribedTo: [],
      },
      {
        applicationId: 'filewriter',
        api: 'FileWriter',
        enabled: true,
        FileWriter: { outputFolder: './output' },
        caching: { sendInterval: 10000, retryInterval: 5000, groupCount: 1000, maxSendCount: 10000 },
        subscribedTo: [],
      },
      {
        applicationId: 'test04',
        api: 'AmazonS3',
        enabled: false,
        AmazonS3: {
          bucket: 'aef',
          folder: 'azsdfcv',
          proxy: '',
          authentication: {
            key: 'myAccessKey',
            secretKey: 'mySecretKey',
          },
        },
        caching: {
          sendInterval: 10000,
          retryInterval: 5000,
          groupCount: 1000,
          maxSendCount: 10000,
        },
        subscribedTo: [],
      },
    ],
  },
  schemaVersion: 5,
  apiList: ['Console', 'OIConnect', 'OIAnalytics'],
  protocolList: ['CSV', 'OPCHDA', 'SQLDbToFile', 'FolderScanner', 'Modbus', 'OPCUA_HA', 'MQTT'],
}

export default testConfig
