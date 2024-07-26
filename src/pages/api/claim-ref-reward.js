import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const claim = async (req, res) => {
  const { id } = req.body
  const url = `${apiUrl}/users/${id}/referrals/claim-accumulated-reward`
  console.log('============ Claim ref reward', url, id)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ claim: true }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: err?.detail })
  }

  const result = await response.json()
  console.log('result', result)
  res.send({ status: 'ok', result })
}

export default claim
