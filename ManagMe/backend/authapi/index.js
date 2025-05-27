import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET
const users = [
  { id: 1, login: 'jan', password: '1234', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
  { id: 2, login: 'anna', password: 'abcd', firstName: 'Anna', lastName: 'Nowak', role: 'user' }
]

let refreshTokens = []

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1m' })
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

  res.json({ token: accessToken, refreshToken })
})


app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).send('Nieprawidłowy refresh token')
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET)
    const user = users.find(u => u.id === payload.id)
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
    if (!found) return res.sendStatus(404)

    const { password, ...userData } = found
    res.json(userData)
  })
})

app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`)
})