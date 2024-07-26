import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const claimTask = async (req, res) => {
  const { id, task_id } = req.body
  const url = `${apiUrl}/users/${id}/claim-task-bounty/${task_id}`

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
    return res.send({ error: 'Failed to claim task' })
  }

  const result = await response.json()
  console.log('result', result)
  res.send({ status: 'ok', result })
}

export default claimTask
