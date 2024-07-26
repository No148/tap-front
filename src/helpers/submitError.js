import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

const submitError = async (err, originalMessage) => {
    let message = originalMessage
    if (domainName.includes('-dev')) return false // no logging to telegram for dev
  
    if (err.status) {
        message += `\nCode: ${err.status} - ${err.statusText || 'Unknown error'}`
    }
  
    const res = await fetch('https://onchainlab.ai/logger-service/log/for/webapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer js82bxXjKAkwkks_Z2`,
      },
      body: JSON.stringify({
        message,
        level: 'error',
      }),
    })
    
    return await res.json()
}

export default submitError
