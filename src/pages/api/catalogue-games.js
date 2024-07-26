import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiKey, apiUrl } = publicRuntimeConfig

const getGames = async (req, res) => {
  const response = await fetch(`${apiUrl}/projects/?limit=200&is_valid=true`, {
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
  res.status(201).json(d.items)
}

export default getGames
