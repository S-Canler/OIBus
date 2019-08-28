import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormText, Label, Input } from 'reactstrap'
import { ConfigContext } from '../../context/configContext.jsx'

const OIbScanMode = ({ label, help, option, name, onChange }) => {
  const { newConfig } = React.useContext(ConfigContext)
  const { scanModes } = newConfig.engine // scan modes defined in engine
  let options = scanModes.map((e) => e.scanMode)
  if (options === null || options.length === 0) {
    options = [''] // allow an empty string if no scan mode on engine
  }
  const defaultOption = options[0]

  React.useEffect(() => {
    if (option === null) onChange(name, defaultOption)
  }, [option])

  const handleChange = (event) => {
    const { target } = event
    const { value: newVal } = target
    onChange(name, newVal, null)
  }
  // if value is null, no need to render
  if (option === null) return null
  return (
    <FormGroup>
      {label && <Label for={name}>{label}</Label>}
      <Input className="oi-form-input" type="select" id={name} name={name} onChange={handleChange} value={option}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Input>
      {help && <FormText>{help}</FormText>}
    </FormGroup>
  )
}
OIbScanMode.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.element,
  onChange: PropTypes.func.isRequired,
  option: PropTypes.string,
}
OIbScanMode.defaultProps = { label: null, help: null, option: null }

export default OIbScanMode
