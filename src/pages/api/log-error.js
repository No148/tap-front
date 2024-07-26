import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { domainName, loggerToken } = publicRuntimeConfig

export const config = {
  api: {
    bodyParser: true,
  },
}

const logError = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { message, level = 'error' } = req.body

  if (!message) return res.send({ status: 'wrong params' })

  // ignore errors on test page
  // if (message.includes('on page /failure')) return res.send({ status: 'ok' })

  const prodDomains = ['cheesus.ai', 'onchainlab.ai', 'suiguru.com', 'aihunter.ai']
  const isProd = prodDomains.includes(domainName)
  let url = `https://${
    isProd ? 'onchainlab.ai' : 'dev.onchainlab.ai'
  }/logger-service/log/for/${domainName}`

  const authorization = `Bearer ${loggerToken}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization,
    },
    body: JSON.stringify({ message, level }),
  })

  if (!response.ok) {
    return res.send({ error: 'no data' })
  }

  res.status(201).json({ status: 'sent' })
}

export default logError
