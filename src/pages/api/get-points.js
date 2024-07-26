import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

const checkUser = async (req, res) => {
  const url = `${apiUrl}/users/${req.query.id}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
  })

  if (!response.ok) {
    console.log(url, response)
    const err = await response.json()
      .catch(() => false)
    return res.send({ error: 'Failed to get user data' })
  }

  const result = await response.json()
  res.send(result)
}

export default checkUser
