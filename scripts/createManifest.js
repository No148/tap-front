const fs = require('fs')
const path = require('path')
require('dotenv').config()

const manifestPath = path.resolve(
  __dirname,
  '..',
  'public',
  'favicon',
  'manifest.json'
)

const manifestDefault = require(manifestPath)

fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      ...manifestDefault,
      name: process.env.TITLE_TEXT,
    },
    null,
    '\t'
  )
)

console.log('[manifest.json] Successfully created')
