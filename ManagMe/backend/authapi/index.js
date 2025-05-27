import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'

dotenv.config()

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const users = [
  { id: 1, login: 'jan', password: '1234', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
  { id: 2, login: 'anna', password: 'abcd', firstName: 'Anna', lastName: 'Nowak', role: 'user' }
]

let refreshTokens = []

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, login: user.login, role: user.role }, JWT_SECRET, { expiresIn: '1m' })
}

function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
  refreshTokens.push(token)
  return token
}

app.post('/login', (req, res) => {
  const { login, password } = req.body
  const user = users.find(u => u.login === login && u.password === password)
  if (!user) return res.status(401).send('Nieprawidłowy login lub hasło')

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  const { password: _, ...userWithoutPassword } = user
  res.json({ token: accessToken, refreshToken, user: userWithoutPassword })
})

app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).send('Nieprawidłowy refresh token')
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET)
    const user = users.find(u => u.id === payload.id)
    if (!user) return res.status(404).send('Użytkownik nie istnieje')

    const newAccessToken = generateAccessToken(user)
    res.json({ token: newAccessToken })
  } catch (err) {
    res.status(403).send('Błąd przy odświeżaniu tokena')
  }
})

app.get('/me', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const found = users.find(u => u.id === user.id)
    if (!found && user.role !== 'guest') return res.sendStatus(404)

    if (user.role === 'guest') {
      return res.json({
        id: user.id,
        login: user.login,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: 'guest'
      })
    }

    const { password, ...userData } = found
    res.json(userData)
  })
})

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

app.post('/auth/google', async (req, res) => {
  const { credential } = req.body
  if (!credential) return res.status(400).send("Brak tokena Google")

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) return res.status(400).send("Niepoprawne dane")

    const guestUser = {
      id: payload.sub,
      login: payload.email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      role: 'guest',
    }

    const accessToken = generateAccessToken(guestUser)
    const refreshToken = generateRefreshToken(guestUser)

    res.json({
      token: accessToken,
      refreshToken,
      user: guestUser,
    })

  } catch (err) {
    console.error(err)
    res.status(403).send("Błąd autoryzacji Google")
  }
})

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`)
})