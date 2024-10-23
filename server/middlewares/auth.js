// Author: zhier1114
const jwt = require('jsonwebtoken')
const db = require('../models/dbConnect')
require('dotenv').config({ path: '../config.env' })

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: '需要認證' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token 已過期' })
      }
      return res.status(403).json({ message: '無效的token' })
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Token 無效：缺少用戶ID' })
    }

    db.query('SELECT valid FROM Users WHERE userId = ?', [decoded.userId], (error, results) => {
      if (error) {
        console.error('查詢用戶驗證狀態錯誤:', error)
        return res.redirect('/user/login')
      }

      if (results.length === 0) {
        return res.status(404).json({ message: '用戶不存在' })
      }

      const user = results[0]
      if (!user.valid) {
        return res.status(401).json({ message: '用戶信箱未驗證' })
      }

      req.userId = decoded.userId
      next()
    })
  })
}
