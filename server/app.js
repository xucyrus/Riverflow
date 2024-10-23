// Author: zhier1114, YuFu
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const app = express()
require('dotenv').config({ path: '../config.env' })

const { authenticateToken } = require('./middlewares/auth')
const { adminAuthenticateToken } = require('./middlewares/adminAuth')

// 加載購物車圖片更改的
app.use(express.static(path.join(__dirname, '../client/public')))
app.use('/riverflow', express.static(path.join(__dirname, '../client/public')))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true
  })
)

// Routers
const userRoutes = require('./routes/users')
const newsRoutes = require('./routes/news')
const productRoutes = require('./routes/products')
const eventRoutes = require('./routes/events')
const stripeRoutes = require('./routes/stripe')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/admin')

// Use routes
app.use('/riverflow', require('./routes/public'))
app.use('/riverflow/user', authenticateToken, userRoutes)
app.use('/riverflow/news', newsRoutes)
app.use('/riverflow/products', productRoutes)
app.use('/riverflow/events', eventRoutes)
app.use('/riverflow/cart', authenticateToken, cartRoutes)
app.use('/riverflow/pay', authenticateToken, stripeRoutes)
app.use('/riverflow/events/Tobuy', authenticateToken, stripeRoutes)

// backstage routes
app.use('/riverflow/admin', adminAuthenticateToken, adminRoutes)

module.exports = app
