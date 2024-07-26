import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

const getStat = async (req, res) => {
  const url = `${apiUrl}/statistics/`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
  })

  if (!response.ok) {
    console.log(url, response)
    const err = await response.json().catch(() => false)
    return res.send({ error: 'Failed to get stats' })
  }

  const result = await response.json()
  res.send(result)
}

export default getStat
