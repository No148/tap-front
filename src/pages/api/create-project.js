import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const createProject = async (req, res) => {
  const { url } = req.body
  console.log('============Create project==============', url)
  const response = await fetch(`${apiUrl}/projects/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({ url }),
  }).catch((err) => {
    console.log(err, 'connection error')
    return res.send({ error: err })
  })
  if (!response || !response.ok) {
    let error = `Failed to create project`
    if (response) {
      const errObj = await response.json().catch((err) => false)
      error = errObj.detail
      console.log('error resp', response)
    }
    return res.send({ error }) // : 'no data' })
  }
  const result = await response.json()
  console.log('result', result)
  res.send({ status: 'ok', result })
}

export default createProject
