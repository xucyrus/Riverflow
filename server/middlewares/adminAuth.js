// Author: zhier1114
const jwt = require('jsonwebtoken')
const db = require('../models/dbConnect')
require('dotenv').config({ path: '../config.env' })

exports.adminAuthenticateToken = (req, res, next) => {
  const token = req.cookies.adminToken

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

    if (!decoded.adminId) {
      return res.status(401).json({ message: 'Token 無效' })
    }

    db.query('SELECT valid FROM Administrators WHERE adminId = ?', [decoded.adminId], (error, results) => {
      if (error) {
        console.error('查詢用戶驗證狀態錯誤:', error)
        return res.status(500).json({ message: '內部服務器錯誤' })
      }

      if (results.length === 0) {
        return res.status(404).json({ message: '管理者不存在' })
      }

      const user = results[0]
      if (!user.valid) {
        return res.status(401).json({ message: '管理者未啟用' })
      }

      req.adminId = decoded.adminId
      next()
    })
  })
}
