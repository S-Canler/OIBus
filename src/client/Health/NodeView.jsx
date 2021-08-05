import React from 'react'
import PropTypes from 'prop-types'
import { Row, Container, Button, UncontrolledTooltip, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import { useHistory, Link } from 'react-router-dom'
import ReactFlow from 'react-flow-renderer'
import { ConfigContext } from '../context/configContext.jsx'
import PointsButton from '../South/PointsButton.jsx'
import Modal from '../components/Modal.jsx'
import ApiSchemas from '../North/Apis.jsx'
import ProtocolSchemas from '../South/Protocols.jsx'
import utils from '../helpers/utils'
import nodeOption from './node-option.png'
import NewApplicationRow from '../North/NewApplicationRow.jsx'
import { AlertContext } from '../context/AlertContext.jsx'

const colors = {
  border: {
    enabled: '1px solid #2ea948',
    disabled: '1px solid #eaecef',
    warning: '1px solid #ffc107',
    success: '1px solid #2ea948',
  },
  background: {
    enabled: '#e1ffe15c',
    enabledd: '#98fb98',
    disabled: '#eaecef5c',
    disabledd: '#696969',
    warning: '#eaecef5c',
    success: '#e1ffe15c',
  },
}
const height = 500
const width = 1240

const NodeView = ({ status, onRestart, onShutdown }) => {
  const { setAlert } = React.useContext(AlertContext)
  const { activeConfig, dispatchNewConfig, apiList } = React.useContext(ConfigContext)
  const applications = activeConfig?.north?.applications
  const dataSources = activeConfig?.south?.dataSources
  const engine = activeConfig?.engine

  const history = useHistory()

  // create a sortable copy to matain original order in case of sort
  const sortableApplications = utils.jsonCopy(applications ?? [])
  // add index for each north application for later use in case of sort
  sortableApplications?.forEach((application, index) => {
    application.index = index
  })

  const getApplicationIndex = ((applicationId) => {
    const position = sortableApplications.findIndex((application) => application.applicationId === applicationId)
    if (position === -1) {
      return position
    }
    return sortableApplications[position].index
  })

  const addApplication = ({ applicationId, api }) => {
    const applicationIndex = getApplicationIndex(applicationId)
    if (applicationIndex === -1) {
      // Adds new application
      dispatchNewConfig({ type: 'addRow', name: 'north.applications', value: { applicationId, api, enabled: false } })
    } else {
      const error = new Error('application already exists')
      setAlert({ text: error.message, type: 'danger' })
      throw error
    }
  }

  const handleDelete = (position) => {
    dispatchNewConfig({ type: 'deleteRow', name: `north.applications.${sortableApplications[position].index}` })
  }

  const handleDuplicate = (position) => {
    const application = applications[sortableApplications[position].index]
    const newName = `${application.applicationId} copy`
    const countCopies = applications.filter((e) => e.applicationId.startsWith(newName)).length
    dispatchNewConfig({
      type: 'addRow',
      name: 'north.applications',
      value: {
        ...application,
        applicationId: `${newName}${countCopies > 0 ? countCopies + 1 : ''}`,
        enabled: false,
      },
    })
  }

  const handleEdit = (position) => {
    const application = sortableApplications[position]
    const link = `/north/${application.applicationId}`
    history.push({ pathname: link })
  }

  const northNodes = applications?.map((application, index) => (

    {
      id: application.applicationId, // unique id of node
      type: 'output', // output node
      targetPosition: 'bottom', // handle is at the bottom
      style: {
        background: colors.background[application.enabled ? 'disabled' : 'disabled'],
        border: colors.border[application.enabled ? 'disabled' : 'disabled'],
        width: '170px',
        height: '25%',
      },
      data: {
        label: (

          <div className="box-container">

            <div className="icon-container">
              <div className="icon-left">
                <img src={`${ApiSchemas[application.api].image}`} alt="logo" height="20px" />
              </div>

              <div className="icon-center flex-grow">
                {`(${application.api})`}
              </div>

              <div className={`icon-right ${application.enabled ? 'icon-status-enabled' : 'icon-status-disabled'}`} />

            </div>

            <div id={`north-${index}`} className={` oi-box tight text-${application.enabled ? 'success' : 'muted'}`}>
              <Link to={`/north/${application.applicationId}`}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {application.applicationId}
                </div>
                <UncontrolledTooltip placement="top" target={`north-${index}`} innerClassName="oi-pop">
                  {application.applicationId}
                </UncontrolledTooltip>
              </Link>
            </div>

            <div>
              <input type="image" id="image" alt="options" height="20px" src={nodeOption} />

              <UncontrolledPopover trigger="legacy" placement="bottom" target="image">
                <PopoverHeader>North Options</PopoverHeader>

                <PopoverBody className="icon-pop">
                  <button
                    className="icon-pop-items"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleEdit(index)
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="icon-pop-items"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDuplicate(index)
                    }}
                  >
                    Duplicate
                  </button>

                  <Modal
                    show={false}
                    title="Delete"
                    body={`Are you sure you want to delete ${application.applicationId}?`}
                  >
                    {(confirm) => (
                      <button
                        className="icon-pop-items"
                        type="button"
                        onClick={confirm((e) => {
                          e.preventDefault()
                          handleDelete(index)
                        })}
                      >
                        Delete
                      </button>
                    )}
                  </Modal>

                </PopoverBody>
              </UncontrolledPopover>
            </div>

          </div>),
      },
      // position the node with an offset to center and then an offset for each node
      position: { x: 620 - 75 * applications.length + index * 200, y: 0 },
    }
  )) ?? []
  const northLinks = applications?.map((application) => (
    {
      id: `${application.applicationId}-engine`,
      source: 'engine',
      target: application.applicationId,
      animated: true,
      type: 'default',
      arrowHeadType: 'arrow',
      isHidden: !application.enabled,
    }
  )) ?? []

  const southNodes = dataSources?.map((dataSource, index) => (
    {
      id: dataSource.dataSourceId,
      type: 'input',
      sourcePosition: 'top',
      style: {
        background: colors.background[dataSource.enabled ? 'enabled' : 'disabled'],
        border: colors.border[dataSource.enabled ? 'enabled' : 'disabled'],
        width: '140px',
        height: '25%',
      },
      data: {
        label: (
          <div id={`south-${index}`} className={`oi-box tight text-${dataSource.enabled ? 'success' : 'muted'}`}>
            <Link to={`/south/${dataSource.dataSourceId}`}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {dataSource.dataSourceId}
              </div>
              <UncontrolledTooltip placement="top" target={`south-${index}`} innerClassName="oi-pop">
                {dataSource.dataSourceId}
              </UncontrolledTooltip>
              <div>{`(${dataSource.protocol})`}</div>
            </Link>
            <PointsButton dataSource={dataSource} />
            <img className="oi-node-image" src={`${ProtocolSchemas[dataSource.protocol].image}`} alt="logo" height="20px" />
          </div>
        ),
      },
      // postion the node with an offset to center and then an offset for each node
      // 6 per line max => potentially render on several lines with y
      position: { x: 620 - (75 * Math.min(dataSources.length, 8)) + (index % 8) * 150, y: 350 + 120 * Math.trunc(index / 8) },
    }
  )) ?? []

  const southLinks = dataSources?.map((dataSource) => (
    {
      id: `${dataSource.dataSourceId}-engine`,
      target: 'engine',
      source: dataSource.dataSourceId,
      animated: true,
      type: 'default',
      arrowHeadType: 'arrow',
      isHidden: !dataSource.enabled,
    }
  )) ?? []

  const elements = [
    ...northNodes,
    ...northLinks,
    {
      id: 'engine',
      data: {
        label: (
          <div className="oi-box">
            <Link to="/engine">
              <div className={`text-${engine?.safeMode ? 'warning oi-safe-mode' : 'success'} center`}>
                {`Engine ${status?.version}${engine?.safeMode ? ' - Safe mode warning' : ''}`}
              </div>
            </Link>
            <Modal show={false} title="Server restart" body="Confirm restart?">
              {(confirm) => (
                <Button
                  className="inline-button autosize oi-restart-button"
                  color={engine?.safeMode ? 'warning' : 'success'}
                  onClick={confirm(onRestart)}
                  size="sm"
                  outline
                >
                  Restart
                </Button>
              )}
            </Modal>
            <Modal show={false} title="Server shutdown" body="Confirm shutdown?">
              {(confirm) => (
                <Button
                  className="inline-button autosize oi-shutdown-button"
                  color={engine?.safeMode ? 'warning' : 'success'}
                  onClick={confirm(onShutdown)}
                  size="sm"
                  outline
                >
                  Shutdown
                </Button>
              )}
            </Modal>

            <Button
              id="addnorth"
              className="inline-button autosize oi-shutdown-button"
              color={engine?.safeMode ? 'warning' : 'success'}
              size="sm"
              outline
            >
              + North
            </Button>

            <UncontrolledPopover className="pop-container" trigger="legacy" placement="bottom" target="addnorth">
              <PopoverHeader>Add a new North connector</PopoverHeader>

              <PopoverBody>

                <NewApplicationRow apiList={apiList} addApplication={addApplication} />

              </PopoverBody>

            </UncontrolledPopover>

          </div>
        ),
      },
      position: { x: 20, y: 165 },
      targetPosition: 'bottom',
      sourcePosition: 'top',
      style: {
        background: colors.background[engine?.safeMode ? 'warning' : 'success'],
        color: 'black',
        border: colors.border[engine?.safeMode ? 'warning' : 'success'],
        width: 1080,
        height: '25%',
      },
    },
    {
      id: 'alive',
      type: 'input',
      sourcePosition: 'left',
      data: {
        label: (
          <Link to="/engine">
            <div
              className={`oi-box d-flex align-items-center text-${engine?.aliveSignal?.enabled ? 'success' : 'muted'}`}
            >
              <div className="oi-alive d-flex align-items-center">
                Alive
              </div>
            </div>
          </Link>
        ),
      },
      position: { x: 1100, y: 185 },
      style: {
        background: colors.background[engine?.aliveSignal?.enabled ? 'enabled' : 'disabled'],
        border: colors.border[engine?.aliveSignal?.enabled ? 'enabled' : 'disabled'],
        width: 100,
      },
    },
    ...southNodes,
    ...southLinks,
  ]

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.setTransform({ y: 0, x: 0, zoom: 0.95 })
  }

  return (
    <Container>
      <Row>
        <div style={{ height, width }}>
          <ReactFlow
            elements={elements}
            zoomOnScroll={false}
            nodesConnectable={false}
            elementsSelectable
            nodesDraggable={false}
            onLoad={onLoad}
          />
        </div>
      </Row>
    </Container>
  )
}

NodeView.propTypes = {
  status: PropTypes.object,
  onRestart: PropTypes.func,
  onShutdown: PropTypes.func,
}
NodeView.defaultProps = {
  status: {},
  onRestart: () => null,
  onShutdown: () => null,
}

export default NodeView
