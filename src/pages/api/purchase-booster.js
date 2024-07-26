import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const purchaseBooster = async (req, res) => {
  const { id, boost } = req.body
  const url = `${apiUrl}/boosters/purchase`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({
      user_id: id,
      boost,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: 'Failed to save data' })
  }

  const result = await response.json()
  console.log('result', result)
  res.send({ status: 'ok', result })
}

export default purchaseBooster
