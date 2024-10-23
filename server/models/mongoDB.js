// models/mongoDB.js
// Author: zhier1114
const mongoose = require('mongoose')
require('dotenv').config({ path: '../config.env' })

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`

const connectToServer = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })
    console.log('Successfully connected to MongoDB.')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    throw err
  }
}

const closeConnection = async () => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed.')
  } catch (err) {
    console.error('Error closing MongoDB connection:', err)
  }
}

module.exports = { connectToServer, closeConnection }
