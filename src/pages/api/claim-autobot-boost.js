import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiKey, apiUrl } = publicRuntimeConfig

const claimAutobotBoost = async (req, res) => {
  const { id } = req.body
  const url = `${apiUrl}/auto-farming/${id}/claim`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({}),
  }).catch((err) => {
    console.log(err, 'connection error')
    return res.send({ errror: err })
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
  res.status(201).json(d)
}

export default claimAutobotBoost
