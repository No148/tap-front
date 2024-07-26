import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}
const increaseRefer = async (req, res) => {
  const { id } = req.body
  const url = `${apiUrl}/user-referral-urls/${id}/increase-referrer-count`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({}),
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

export default increaseRefer
