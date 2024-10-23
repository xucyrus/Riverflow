// Author: zhier1114
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// 會員
router.post('/user/register', authController.register) // 註冊
router.get('/verify/:token', authController.verifyEmail) // 信箱驗證
router.post('/user/login', authController.login) // 登入
router.get('/user/logout', authController.logout) // 登出
router.get('/reset-password', authController.resetPasswordPage) // 忘記密碼：輸入帳號（前端頁面）
router.post('/reset-password', authController.requestPasswordReset) // 輸入email，發送驗證信
router.get('/reset-password/:token', authController.setNewPasswordPage) // 輸入新密碼（前端頁面）
router.post('/reset-password/:token', authController.resetPassword) // 驗證後儲存新密碼

// 管理員
router.post('/admin/login', authController.adminLogin) // 登入
router.get('/admin/logout', authController.adminLogout) // 登出

module.exports = router
