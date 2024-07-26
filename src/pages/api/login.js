import { checkEmailWhitelist } from '@/helpers/auth'

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

const login = async (req, res) => {
  if (!req.method === 'POST') return res.send({ status: 'wrong request' })

  const { cred = false } = req.body
  if (!cred) return res.status(403).send({ status: 'wrong params' })
  const profile = parseJwt(cred)

  const user = checkEmailWhitelist(profile.email)
  if (!user) return res.status(403).send({ error: 'access blocked' })

  return res.json({ user })
}

export default login
