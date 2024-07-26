import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const checkUser = async (req, res) => {
  const obj = req.body
  console.log('check new user', obj, typeof obj)

  const url = `${apiUrl}/users/get-or-upsert`
  // delete obj.points

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify(obj),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: 'Failed to get user data' })
  }

  const result = await response.json()
  res.send(result)
}

export default checkUser
