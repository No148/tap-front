import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { apiKey, apiUrl } = publicRuntimeConfig

const getRandomLinks = async (req, res) => {
  const { exclude_ids, user_url } = req.query

  let url = `${apiUrl}/user-referral-urls/random?exclude_project_urls=${user_url}`
  if (exclude_ids) {
    url += `&exclude_ids=${exclude_ids}`
  }

  console.log('TRY', url)
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
    let error = `Failed to get random links`
    if (response) {
      const errObj = await response.json().catch((err) => false)
      const c = errObj && errObj.err_msg ? errObj.err_msg : error
      error = c
      console.log('error resp', response, c)
    }

    return res.send({ error }) // : 'no data' })
  }

  const d = await response.json()
  res.status(201).json(d)
}

export default getRandomLinks
