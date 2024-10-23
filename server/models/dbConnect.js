// Author: zhier1114
const dotenv = require('dotenv')
const util = require('util')
dotenv.config({ path: '../../config.env' })

const mysql = require('mysql')
const dbConnect = mysql.createConnection({
  user: process.env.DB_ACCOUNT,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
})

dbConnect.connect((err) => {
  if (err) {
    console.error('Database connect failed:', err)
  } else {
    console.log('Database connection established')
  }
})

dbConnect.queryAsync = util.promisify(dbConnect.query).bind(dbConnect)

module.exports = dbConnect
