import Node from '@zenoo-libraries/common/Node'
import { Interaction, InteractionAbility } from '@zenoo/hub-design-studio-core/common'
import { includeLibraryFile } from 'library-utils'

import { icons } from '../../icons'
import Settings from './Settings'

const ProofOfAddressCheck: Interaction = {
  author: 'Zenoo',
  type: 'default',
  name: 'ProofOfAddressCheck',
  displayName: 'Proof of Address Check',
  description: 'Verify proof of address documents using ComplyCube',
  icon: icons.complycube,
  category: 'Compliance',
  abilities: [InteractionAbility.api],
  inputConnector: {
    name: 'default',
  },
  outputConnectors: [
    {
      name: 'success',
      displayName: 'Verified',
      color: 'green',
    },
    {
      name: 'review',
      displayName: 'Needs Review',
      color: 'orange',
    },
    {
      name: 'failed',
      displayName: 'Failed',
      color: 'red',
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
      uri: 'proof-of-address-check',
      name: 'Proof of Address Check',
      description: 'Verify proof of address documents using ComplyCube',
    },
  },
}

export default ProofOfAddressCheck