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

const savePoints = async (req, res) => {
  const { id, taps, tappingStartedDate } = req.body
  console.log('save balance', id, taps)

  if (taps < 1) return res.send({ status: 'not changed' })

  const url = `${apiUrl}/users/${id}/add-taps`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({ taps, tapping_started_date: tappingStartedDate }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.log(url, err)
    return res.send({ error: 'Failed to save data' })
  }

  const result = await response.json()
  res.send({ status: 'ok', points: result.points })
}

export default savePoints
