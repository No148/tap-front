import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const saveFav = async (req, res) => {
  const { user_id, project_id } = req.body
  if (!user_id) return res.send({ error: 'wrong params' })

  const url = `${apiUrl}/favorites/projects/${user_id}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ project_id }),
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

export default saveFav
