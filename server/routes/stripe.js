//Author: YuFu
const express = require('express')
const router = express.Router()
const stripeController = require('../controllers/stripeController')

//商品金流
router.post('/create-checkout-session', stripeController.createCheckoutSession)
//活動金流
router.post('/create-event-checkout-session', stripeController.createEventCheckoutSession)
//金流回傳
router.get('/payment-success', stripeController.handleSuccessfulPayment)

module.exports = router
