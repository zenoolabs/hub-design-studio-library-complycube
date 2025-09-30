import Node from '@zenoo-libraries/common/Node'
import { Interaction, InteractionAbility } from '@zenoo/hub-design-studio-core/common'
import { includeLibraryFile } from 'library-utils'

import { icons } from '../../icons'
import Settings from './Settings'

const AMLScreening: Interaction = {
  author: 'Zenoo',
  type: 'default',
  name: 'AMLScreening',
  displayName: 'AML Screening',
  description: 'Perform AML and PEP screening using ComplyCube',
  icon: icons.complycube,
  category: 'Compliance',
  abilities: [InteractionAbility.api],
  inputConnector: {
    name: 'default',
  },
  outputConnectors: [
    {
      name: 'clear',
      displayName: 'Clear',
      color: 'green',
    },
    {
      name: 'attention',
      displayName: 'Needs Attention',
      color: 'orange',
    },
    {
      name: 'not_processed',
      displayName: 'Not Processed',
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
      uri: 'aml-screening',
      name: 'AML Screening',
      description: 'Perform AML and PEP screening using ComplyCube',
    },
  },
}

export default AMLScreening