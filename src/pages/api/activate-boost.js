import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const activateBoost = async (req, res) => {
  const { id, boost } = req.body
  const url = `${apiUrl}/users/${id}/boosters/${boost}/activate`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ update: true }),
  }).catch((err) => false)

  if (!response.ok) {
    return res.send({ error: 'failed to activate' })
  }

  const result = await response.json()
  res.send({ status: result ? 'ok' : 'failed' })
}

export default activateBoost
