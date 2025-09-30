import React from 'react'
import {
  Section,
  Group,
  TextField,
  Select,
  InteractionName
} from '@zenoo-libraries/common'

const screeningTypes = [
  { value: 'standard_screening_check', label: 'Standard Screening' },
  { value: 'extensive_screening_check', label: 'Extensive Screening' }
]

const searchModes = [
  { value: 'fuzzy', label: 'Fuzzy Matching' },
  { value: 'precise', label: 'Precise Matching' }
]

const Settings = () => {
  return (
    <Section>
      <Group>
        <InteractionName withoutTranslations />
        <TextField
          name="attributes.clientId"
          label="Client ID"
          placeholder="Enter the client ID to screen"
        />
        <Select
          name="attributes.screeningType"
          label="Screening Type"
          options={screeningTypes}
        />
        <Select
          name="attributes.searchMode"
          label="Search Mode"
          options={searchModes}
        />
      </Group>
    </Section>
  )
}

export default Settings