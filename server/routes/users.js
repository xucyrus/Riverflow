// Author: zhier1114
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// 會員中心：會員資料（首頁）
router.get('/', userController.getUserInfo)
// 會員中心：更新資料
router.put('/update', userController.updateUserInfo)
// 會員中心：更新照片
router.post('/update/img', userController.updateUserImg)

// 會員中心：商品資訊
router.get('/products', userController.getAllOrders)
router.get('/products/:orderId', userController.getOneOrder)

// 會員中心：訂票資訊
router.get('/events', userController.getUserEvents)

// 會員中心：我的最愛商品
router.get('/favorites', userController.getFavorites)
// 會員中心：刪除最愛商品
router.delete('/favorites/:productId', userController.deleteFavorite)
// 會員中心：新增最愛商品
router.post('/favorites/:productId', userController.postFavorite)

module.exports = router
