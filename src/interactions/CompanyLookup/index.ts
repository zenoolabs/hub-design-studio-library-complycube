import Node from '@zenoo-libraries/common/Node'
import { Interaction, InteractionAbility } from '@zenoo/hub-design-studio-core/common'
import { includeLibraryFile } from 'library-utils'

import { icons } from '../../icons'
import Settings from './Settings'

const CompanyLookup: Interaction = {
  author: 'Zenoo',
  type: 'default',
  name: 'CompanyLookup',
  displayName: 'Company Lookup',
  description: 'Retrieve detailed company information using ComplyCube',
  icon: icons.complycube,
  category: 'Compliance',
  abilities: [InteractionAbility.api],
  inputConnector: {
    name: 'default',
  },
  outputConnectors: [
    {
      name: 'success',
      displayName: 'Found',
      color: 'green',
    },
    {
      name: 'not_found',
      displayName: 'Not Found',
      color: 'orange',
    },
    {
      name: 'error',
      displayName: 'Error',
      color: 'red',
    },
  ],
  targetFactory: [],
  workflowFactory: {
    main: includeLibraryFile('./workflow/main.wf'),
  },
  validate: [],
  renderNode: Node,
  renderEditor: Settings,
  initialData: {
    attributes: {
      uri: 'company-lookup',
      name: 'Company Lookup',
      description: 'Retrieve detailed company information using ComplyCube',
    },
  },
}

export default CompanyLookup