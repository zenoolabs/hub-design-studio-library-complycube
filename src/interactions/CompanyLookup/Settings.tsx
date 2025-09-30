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
          name="attributes.companyId"
          label="Company ID"
          placeholder="Enter the company identifier to lookup"
        />
      </Group>
    </Section>
  )
}

export default Settings