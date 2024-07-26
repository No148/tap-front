import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

const checkRefs = async (req, res) => {
  const { id, page = 1, limit = 100 } = req.query
  const url = `${apiUrl}/users/${id}/referrals?page=${page}&limit=${limit}`
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

  const sum = {
    earned: 0,
    referrals: 0,
    list: [],
  }

  const result = await response.json()
  console.log('my refs', result)
  sum.referrals = result.total_count
  result.referrals.forEach((item) => {
    if (item.reward > 0) sum.earned += item.reward
    sum.list.push({
      name: item.first_name,
      level: item.level_info.title,
      reward: item.reward,
      points: item.points,
      progress: Math.floor((item.taps / item.next_level_taps) * 100),
    })
  })
  res.send(sum)
}

export default checkRefs
