import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const secret = process.env.JWT_SECRET

const payload = {
  role: 'supabase_admin',
  iss: 'supabase'
}

const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '10h' })

const decoded = jwt.verify(token, secret)

console.log({ token, decoded })
