import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const openBox = async (req, res) => {
  const { id, box_id } = req.query
  const url = `${apiUrl}/lootboxes/${box_id}/activate_lootbox`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ user: id }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: 'Failed to open lootbox' })
  }

  const result = await response.json()
  console.log('result', result)
  res.send({ status: 'ok', result })
}

export default openBox
