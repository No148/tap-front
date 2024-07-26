import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiUrl, apiKey } = publicRuntimeConfig

const checkRefs = async (req, res) => {
  const url = `${apiUrl}/lootboxes/by-user/${req.query.id}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
  })

  if (!response.ok) {
    console.log(url, response)
    const err = await response.json()
      .catch(() => false)
    return res.send({ error: 'Failed to get user data' })
  }

  const sum = { available: false, count: 0 }

  const result = await response.json()
  console.log('lootboxes', result)

  result.items.forEach((item) => {
    console.log(item, 'found lootbox')
    if (!item.activated) {
      sum.id = item._id
      sum.available = true
      sum.count++
    }
  })
  res.send(sum)
}

export default checkRefs
