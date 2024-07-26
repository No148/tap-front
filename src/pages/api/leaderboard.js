import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiKey, apiUrl } = publicRuntimeConfig

const leaderboard = async (req, res) => {
  const { user_id, sort = '-points', limit = 50 } = req.query
  let url = `${apiUrl}/users/leaderboard?sort=${sort}&limit=${limit}&user_id=${user_id}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
  }).catch((err) => {
    console.log(err, 'connection error')
    return res.send({ error: err })
  })

  if (!response || !response.ok) {
    let error = `Failed to get tasks`
    if (response) {
      const errObj = await response.json().catch((err) => false)
      const c = errObj && errObj.err_msg ? errObj.err_msg : error
      error = c
      console.log('error resp', response)
    }
    return res.send({ error }) // : 'no data' })
  }
  const d = await response.json()
  res.status(201).json(d)
}

export default leaderboard
