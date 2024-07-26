import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiKey, apiUrl } = publicRuntimeConfig

const getFavGames = async (req, res) => {
  const url = `${apiUrl}/favorites/projects/${req.query.id}?limit=200`
  console.log('load ', url)

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
    // console.log(err, 'connection error')
    let error = `Failed to get favorites`
    if (response) {
      const errObj = await response.json().catch((err) => false)
      const c = errObj && errObj.err_msg ? errObj.err_msg : error
      error = c
      console.log('error resp', response)
    }
    return res.send({ error }) // : 'no data' })
  }

  const d = await response.json()
  console.log('YABA DOO', d)
  res.status(201).json(d.items || [])
}

export default getFavGames
