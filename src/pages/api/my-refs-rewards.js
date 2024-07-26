import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

const checkRefRewards = async (req, res) => {
  const { id } = req.query
  const url = `${apiUrl}/users/${id}/referrals/accumulated-rewards`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
  })

  if (!response.ok) {
    console.log(url, response)
    const err = await response.json().catch(() => false)
    return res.send({ error: 'Failed to get user data' })
  }

  const sum = await response.json()
  console.log('W00', sum)
  res.send(sum)
}

export default checkRefRewards
