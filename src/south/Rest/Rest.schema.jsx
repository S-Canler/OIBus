import React from 'react'
import { notEmpty, optional } from '../../services/validation.service'

const schema = { name: 'Rest' }
schema.form = {
  RestSettings: {
    type: 'OIbTitle',
    children: (
      <div>
        <ul>
          <li>
            <b>Port Number:</b>
            Port number to listen (should not be the OIBus admin interface)
          </li>
        </ul>
      </div>
    ),
  },
  portNumber: {
    type: 'OIbInteger',
    defaultValue: 2224,
    help: <div>port number</div>,
  },
  username: {
    type: 'OIbText',
    valid: optional(),
    defaultValue: '',
    help: <div>authorized user</div>,
  },
  password: {
    type: 'OIbPassword',
    newRow: false,
    valid: optional(),
    defaultValue: '',
    help: <div>password</div>,
  },
}

schema.points = {
  pointId: {
    type: 'OIbText',
    valid: notEmpty(),
    defaultValue: '',
  },
  scanMode: {
    type: 'OIbText',
    valid: notEmpty(),
    defaultValue: 'listen',
    disabled: true,
    label: 'Scan Mode',
  },
}

export default schema
