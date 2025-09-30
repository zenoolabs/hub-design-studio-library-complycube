const dslGeneratorOptions = {
  workflowGeneratorStrategy: 'paths-new-config-new',
  beautifyCode: true,
  workflowAdditions: [],
  components: {},
  preinit: {
    dependencies: [
      {
        name: 'complycube',
        url: 'https://github.com/zenoolabs/hub-plugin-complycube-proof-of-address',
        version: '0.1.0'
      }
    ],
    snippets: [
      {
        name: 'proof-of-address-check',
        function: 'proof-of-address-check@complycube'
      },
      {
        name: 'get-company-details',
        function: 'get-company-details@complycube'
      },
      {
        name: 'create-screening-check',
        function: 'create-screening-check@complycube'
      }
    ],
  },
}

const targetGeneratorOptions = {}

const workflowUpgradeScript = (workflow: any, interactions: any, utils: any, versionsInfo: any) => {
  return workflow
}

export default {
  dslGeneratorOptions,
  targetGeneratorOptions,
  workflowUpgradeScript,
}