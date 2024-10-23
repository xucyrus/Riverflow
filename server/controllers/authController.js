// Author: zhier1114
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config({ path: '../config.env' })

// 發送email設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

// 發送驗證email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/verify/${token}`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'RiverFlow：驗證帳號',
    text: `親愛的用戶，您好：

請複製並在瀏覽器中打開以下連結以驗證您的帳號:
${verificationUrl}

如果您沒有註冊 RiverFlow 帳號，請忽略此郵件。

祝您使用愉快！
RiverFlow 團隊`,
    html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .button { background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h3>親愛的用戶，您好：</h3>
        <p>請點擊下方按鈕驗證您的帳號:</p>
        <a href="${verificationUrl}" class="button" style="color: white;">驗證帳號</a>
        <p>或複製並在瀏覽器中打開以下連結：</p>
        <p>${verificationUrl}</p>
        <p>如果您沒有註冊 RiverFlow 帳號，請忽略此郵件。</p>
        <p>祝您使用愉快！<br>RiverFlow 團隊</p>
      </body>
    </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('驗證郵件已發送到:', email)
  } catch (error) {
    console.error('發送驗證郵件時發生錯誤:', error)
    throw error // 重新拋出錯誤，以便在 register 函數中捕獲
  }
}

// 會員註冊
exports.register = async (req, res) => {
  const { email, secret, firstName, lastName } = req.body
  const valid = false
  let userId = null
  let userCreated = false

  try {
    // 檢查是否已存在相同email的用戶
    const existingUser = await userModel.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: '此email已被註冊' })
    }

    // 創建新用戶
    const hashedSecret = await bcrypt.hash(secret, 12)
    userId = await userModel.create(email, hashedSecret, firstName, lastName, valid)
    userCreated = true
    console.log('用戶創建成功，ID:', userId)

    // 生成驗證 token
    const verificationToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1d' })

    // 發送驗證郵件
    await sendVerificationEmail(email, verificationToken)

    res.status(201).json({ message: `註冊成功：${firstName + lastName}，請檢查您的email進行驗證` })
  } catch (error) {
    if (userCreated && userId) {
      try {
        const deleted = await userModel.deleteUser(userId)
        if (deleted) {
          console.log('成功刪除未完成註冊的用戶:', userId)
        } else {
          console.error('未能刪除用戶，可能用戶不存在:', userId)
        }
      } catch (deleteError) {
        console.error('刪除用戶時發生錯誤:', deleteError)
      }
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '此email已被註冊' })
    } else if (error.code === 'EAUTH') {
      return res.status(500).json({ message: '郵件發送失敗，請稍後再試。已刪除未驗證的帳號。' })
    }

    res.status(500).json({ message: '註冊失敗，請稍後再試' })
  }
}

// 驗證信箱
exports.verifyEmail = async (req, res) => {
  const { token } = req.params
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findByEmail(decoded.email)
    if (!user) {
      return res.status(400).json({ message: '無效的驗證令牌' })
    }
    await userModel.updateValidStatus(user.userId, true)
    res.json({ message: 'email驗證成功' })
  } catch (error) {
    console.error('驗證錯誤:', error)
    if (error.name === 'TokenExpiredError') {
      res.status(400).json({ message: '驗證連結已過期，請重新註冊' })
    } else {
      res.status(500).json({ message: '驗證失敗，請稍後再試' })
    }
  }
}

// 會員登入
exports.login = async (req, res) => {
  const { email, secret } = req.body

  try {
    const user = await userModel.findByEmail(email)

    if (!user) {
      return res.status(401).json({ message: 'email或密碼不正確' })
    }

    if (!user.valid) {
      return res.status(401).json({ message: '請先至信箱內進行驗證' })
    }

    const isMatch = await bcrypt.compare(secret, user.secret)
    if (!isMatch) {
      return res.status(401).json({ message: 'email或密碼不正確' })
    }

    if (!user.userId) {
      return res.status(500).json({ message: '內部服務器錯誤' })
    }

    const newToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
    })

    res.json({ message: '登入成功', userId: user.userId })
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ message: '登入失敗，請稍後再試' })
  }
}

// 會員登出
exports.logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: '登出成功' })
}

// 修改密碼請求
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body
  try {
    const user = await userModel.findByEmail(email)

    if (!user) {
      return res.status(400).json({ message: '無效的email' })
    }

    if (!user.valid) {
      return res.status(400).json({ message: '請先至信箱內進行驗證' })
    }

    const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'RiverFlow：修改密碼',
      text: `親愛的用戶，您好：
  
  請複製並在瀏覽器中打開以下連結以前往密碼修改頁面:
  ${resetUrl}
  如果您沒有請求重置密碼，請忽略此郵件，您的密碼將保持不變。此連結將在1小時後失效。
  如果您沒有註冊 RiverFlow 帳號，請忽略此郵件。
  
  祝您使用愉快！
  RiverFlow 團隊`,
      html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .button { background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h3>親愛的用戶，您好：</h3>
          <p>請點擊下方按鈕前往密碼修改頁面:</p>
          <a href="${resetUrl}" class="button" style="color: white;">密碼修改</a>
          <p>或複製並在瀏覽器中打開以下連結：</p>
          <p>${resetUrl}</p>

                  <p>如果您沒有請求重置密碼，請忽略此郵件，您的密碼將保持不變。</p>
        <p>此連結將在1小時後失效。</p>
          <p>如果您沒有註冊 RiverFlow 帳號，請忽略此郵件。</p>
          <p>祝您使用愉快！<br>RiverFlow 團隊</p>
        </body>
      </html>
      `
    }

    // 發送郵件
    await transporter.sendMail(mailOptions)

    // res.json({ message: '密碼重置連結已發送到您的信箱' })
    res.json({ message: '密碼重置連結已發送到您的信箱', token: resetToken })
  } catch (error) {
    console.error('請求密碼重置錯誤:', error)
    if (error.code === 'EAUTH') {
      console.error('SMTP authentication error:', error.message)
      return res.status(500).json({ message: '郵件發送失敗，請檢查郵件設置' })
    }
    if (error.code === 'ESOCKET') {
      console.error('SMTP connection error:', error.message)
      return res.status(500).json({ message: '郵件服務器連接失敗，請檢查網絡設置' })
    }
    res.status(500).json({ message: '發生錯誤，請稍後再試' })
  }
}

// 重設密碼
exports.resetPassword = async (req, res) => {
  const { token } = req.params
  const { newSecret } = req.body

  try {
    // 驗證 JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findByEmail(decoded.email)

    if (!user) {
      return res.status(400).json({ message: '無效的用戶' })
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(newSecret, 12)
    await userModel.updatePassword(user.userId, hashedPassword)

    res.json({ message: '密碼重置成功' })
  } catch (error) {
    console.error('重置密碼錯誤:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: '無效或過期的重置令牌' })
    }
    res.status(500).json({ message: '密碼重置過程中發生錯誤，請稍後再試' })
  }
}

// 暫用：輸入帳號的頁面
exports.resetPasswordPage = function (req, res) {
  res.json({ 輸入帳號: '請輸入帳號' })
}

// 暫用：輸入新密碼的頁面
exports.setNewPasswordPage = function (req, res) {
  res.json({ 輸入新密碼: '請輸入新密碼' })
}

// 管理員登入
exports.adminLogin = async (req, res) => {
  const { account, secret } = req.body

  try {
    const admin = await adminModel.findAccount(account)

    if (!admin) {
      return res.status(401).json({ message: '帳號或密碼不正確' })
    }

    if (!admin.valid) {
      return res.status(401).json({ message: '無效的帳號' })
    }

    const isMatch = await bcrypt.compare(secret, admin.secret)
    if (!isMatch) {
      return res.status(401).json({ message: '帳號或密碼不正確' })
    }

    if (!admin.adminId) {
      return res.status(500).json({ message: '內部服務器錯誤' })
    }

    const newToken = jwt.sign({ adminId: admin.adminId }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('adminToken', newToken, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
    })

    res.json({ message: '管理員登入成功', token: newToken })
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ message: '登入失敗，請稍後再試' })
  }
}

// 管理員登出
exports.adminLogout = (req, res) => {
  res.clearCookie('adminToken')
  res.json({ message: '管理員登出成功' })
}
