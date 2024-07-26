import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

const usersScore = {}

export const config = {
  api: {
    bodyParser: true,
  },
}

const inviteFriends = async (req, res) => {
  const { id } = req.body

  if (!id) return res.send({ status: 'not changed' })

  const url = `${apiUrl}/users/${id}/bot-send-invite-friends`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({ invite: true }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: 'Failed to save data' })
  }

  const result = await response.json()
  res.send({ status: 'ok' })
}

export default inviteFriends
