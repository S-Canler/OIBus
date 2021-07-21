import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Breadcrumb, BreadcrumbItem, Container } from 'reactstrap'
import { AlertContext } from '../context/AlertContext.jsx'
import Table from '../components/table/Table.jsx'

const SouthStatus = () => {
  const [connectorData, setConnectorData] = React.useState({})
  const { setAlert } = React.useContext(AlertContext)
  const { dataSourceId } = useParams() // the dataSourceId passed in the url

  React.useEffect(() => {
    const source = new EventSource(`/south/${dataSourceId}/sse`)
    source.onerror = (error) => {
      setAlert({ text: error.message, type: 'danger' })
    }
    source.onmessage = (event) => {
      const myData = JSON.parse(event.data)
      console.log('myData', myData)
      const myUpdatedData = {}
      switch (myData.protocol) {
        case 'MQTT':
          myUpdatedData.numberOfValues = myData.numberOfValues
          myUpdatedData.lastValuesAddedTime = myData.lastAddPointsAt
          break

        case 'Modbus':
          myUpdatedData['Number of values'] = myData.numberOfValues
          myUpdatedData.lastScanTime = myData.lastOnScanAt
          myUpdatedData.connectedSince = myData.connection
          break

        case 'FolderScanner':
          myUpdatedData.numberOfFilesAdded = myData.numberOfValues
          myUpdatedData.lastScanTime = myData.lastOnScanAt
          myUpdatedData.lastfileAddedTime = myData.lastOnScanAt
          break

        default:
          break
      }
      setConnectorData(myUpdatedData)
    }
    return (() => source.close())
  }, [])

  /**
   * Generate row entry for the status table.
   * @param {string} key - The key
   * @param {string} value - The value
   * @return {[{name: *, value: *}, {name: string, value: *}]} - The table row
   */
  const generateRowEntry = (key, value) => [
    {
      name: key,
      value: key,
    },
    {
      name: 'value',
      value: value || '',
    },
  ]

  const tableRows = []
  Object.keys(connectorData).forEach((key) => {
    tableRows.push(generateRowEntry(key, connectorData[key]))
  })
  console.log(tableRows)
  return (
    <>
      <Breadcrumb tag="h5">
        <BreadcrumbItem tag={Link} to="/" className="oi-breadcrumb">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem tag={Link} to="/south" className="oi-breadcrumb">
          South
        </BreadcrumbItem>
        <BreadcrumbItem tag={Link} to={`/south/${dataSourceId}`} className="oi-breadcrumb">
          {dataSourceId}
        </BreadcrumbItem>
        <BreadcrumbItem active tag="span">
          Live-status
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Container>{tableRows.length > 0 && <Table headers={[]} rows={tableRows} />}</Container>
      </Row>
    </>
  )
}
export default SouthStatus
