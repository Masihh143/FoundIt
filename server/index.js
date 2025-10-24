import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello from Server')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})