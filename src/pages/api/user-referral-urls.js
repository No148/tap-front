import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig

const userReferralUrls = async (req, res) => {
  if (req.method === 'POST') {
    const url = `${apiUrl}/user-referral-urls/`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
          
      body: JSON.stringify(req.body),
    })

    if (!resp.ok) {
      const error = await resp.json()
      console.log(resp, error)
      return res.send({ error })
    }

    const result = await resp.json()
    res.send({ status: 'ok', result })
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default userReferralUrls
