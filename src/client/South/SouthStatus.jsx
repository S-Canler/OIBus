import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Label, List, Row, Breadcrumb, BreadcrumbItem, Container } from 'reactstrap'
import { AlertContext } from '../context/AlertContext.jsx'
import Table from '../components/table/Table.jsx'

const SouthStatus = () => {
  // const [messages, setMessages] = React.useState([])
  const [connectorData, setConnectorData] = React.useState({
    numberOfValues: 0,
    connectedSince: 0,
  })
  const { setAlert } = React.useContext(AlertContext)
  const { dataSourceId } = useParams() // the dataSourceId passed in the url

  React.useEffect(() => {
    const source = new EventSource(`/south/${dataSourceId}/sse`)
    source.onerror = (error) => {
      setAlert({ text: error.message, type: 'danger' })
    }
    source.onmessage = (event) => {
      const myData = JSON.parse(event.data)
      const myStatusData = {
        numberOfValues: myData.numberOfValues,
        connectedSince: myData.firstDateConnexion,
      }
      setConnectorData(myStatusData)
    }
    return (() => source.close())
  }, [])

  // start modification for data in table ,,,,,,,,,,,

  /**
   * Generate string value from on object.
   * @param {Object[]} data - The object
   * @return {string} - The string value
   */
  const generateStringValueFromObject = (data) => {
    let stringValue = ''
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'name') {
        stringValue += stringValue ? ` / ${key}: ${value}` : `${key}: ${value}`
      }
    })
    return stringValue
  }

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
      value,
    },
  ]

  const tableRows = []
  Object.keys(connectorData).forEach((key) => {
    if (Array.isArray(connectorData[key])) {
      connectorData[key].forEach((entry) => {
        tableRows.push(generateRowEntry(entry.name, generateStringValueFromObject(entry)))
      })
    } else {
      tableRows.push(generateRowEntry(key, connectorData[key]))
    }
  })

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
          Live
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Label>
          <span>
            {`${dataSourceId} status`}
            &nbsp;
          </span>
        </Label>
      </Row>
      <Container fluid>
        <List>
          {Object.entries(connectorData).map(([key, value]) => (
            <li key={key}>
              {key}
              :
              {value}
            </li>
          ))}
        </List>
      </Container>
      <Row>
        <Container>{tableRows && <Table headers={[]} rows={tableRows} />}</Container>
      </Row>
    </>
  )
}
export default SouthStatus
