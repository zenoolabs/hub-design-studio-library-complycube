import React from 'react'
import {
  Section,
  Group,
  TextField,
  InteractionName
} from '@zenoo-libraries/common'

const Settings = () => {
  return (
    <Section>
      <Group>
        <InteractionName withoutTranslations />
        <TextField
          name="attributes.clientId"
          label="Client ID"
          placeholder="Enter the ComplyCube client ID"
        />
        <TextField
          name="attributes.documentId"
          label="Document ID"
          placeholder="Enter the document ID to verify"
        />
      </Group>
    </Section>
  )
}

export default Settings