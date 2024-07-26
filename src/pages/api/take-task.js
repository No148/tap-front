import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const takeTask = async (req, res) => {
  const { id, task_id, lang, project_url = '' } = req.body
  const url = `${apiUrl}/users/${id}/add-task-bounty/${task_id}`
  console.log('============Add task bounty', url, id, task_id)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify(project_url ? { project_url } : { lang }),
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

export default takeTask
