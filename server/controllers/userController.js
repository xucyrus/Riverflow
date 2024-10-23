// Author: zhier1114
const userModel = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// 會員中心首頁：顯示會員資料
exports.getUserInfo = async (req, res) => {
  try {
    // req.userId 已經由認證中間件設置
    const user = await userModel.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' })
    }

    // 返回用戶信息，但排除敏感數據
    const { secret, ...userInfo } = user
    res.json(userInfo)
  } catch (error) {
    console.error('獲取會員信息錯誤:', error)
    res.status(500).json({ message: '獲取會員信息失敗' })
  }
}

// 更新會員資料
exports.updateUserInfo = async (req, res) => {
  const { firstName, lastName, sex, phone, birth, userImg } = req.body
  try {
    const updated = await userModel.updateUser(req.userId, { firstName, lastName, sex, phone, birth, userImg })
    if (!updated) {
      return res.status(404).json({ message: '用戶不存在或未更新任何資料' })
    }
    res.json({ message: '更新成功' })
  } catch (error) {
    console.error('更新失敗:', error)
    res.status(500).json({ message: '更新失敗', error: error.message })
  }
}

// 更新會員照片
const projectRoot = path.join(__dirname, '..', '..')
const uploadDirectory = path.join(projectRoot, 'client', 'src', 'assets', 'images', 'users')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    const fileName = `user${req.userId}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG AND PNG are allowed.'))
  }
}
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB
  },
  fileFilter
})
exports.updateUserImg = [
  upload.single('userImg'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded')
      }
      const fileName = req.file.filename
      const oldImageName = await userModel.getUserImageName(req.userId)
      if (oldImageName) {
        const oldImagePath = path.join(uploadDirectory, oldImageName)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      await userModel.updateUserImg(req.userId, fileName)

      res.status(200).json({ message: 'File uploaded and saved successfully', fileName })
    } catch (err) {
      console.error('Error in updateUserImg:', err)
      res.status(500).json({ error: 'Internal server error', details: err.message })
    }
  }
]

// 會員商品訂單
exports.getAllOrders = async (req, res) => {
  try {
    const allOrder = await userModel.findAllOrders(req.userId)
    res.json(allOrder)
  } catch (err) {
    console.error('獲取商品訂單失敗：', err)
    res.status(500).json({ message: err.message })
  }
}

// 會員商品訂單明細
exports.getOneOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const oneOrder = await userModel.findOneOrder(req.userId, orderId)

    if (!oneOrder) {
      return res.status(404).json({ message: '訂單不存在' })
    }

    oneOrder.orderItem = await userModel.findOneOrderDetail(orderId)
    console.log(oneOrder)

    res.json(oneOrder)
  } catch (err) {
    console.error('獲取商品訂單失敗：', err)
    res.status(500).json({ message: err.message })
  }
}

// 會員購票訂單
exports.getUserEvents = async (req, res) => {
  try {
    const allEvents = await userModel.findUserEvents(req.userId)
    res.json(allEvents)
  } catch (err) {
    console.error('獲取購票訂單失敗：', err)
    res.status(500).json({ message: err.message })
  }
}

// 會員最愛商品
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await userModel.findFavorites(req.userId)
    console.log(favorites)

    res.json(favorites)
  } catch (err) {
    console.error('獲取最愛商品失敗：', err)
    res.status(500).json({ message: err.message })
  }
}

// 會員刪除最愛商品
exports.deleteFavorite = async (req, res) => {
  try {
    const productId = req.params.productId
    const result = await userModel.deleteFavorite(req.userId, productId)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '找不到此最愛商品' })
    }
    res.json({ message: '移除最愛商品成功' })
  } catch (err) {
    console.error('移除最愛商品失敗：', err)
    res.status(500).json({ message: err.message })
  }
}

//會員新增最愛商品
exports.postFavorite = async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await userModel.addFavorite(req.userId, productId);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: '無法添加此商品到收藏' });
    }
    
    res.status(201).json({ message: '成功添加商品到收藏' });
  } catch (err) {
    console.error('添加收藏商品失敗：', err);
    
    // 檢查是否為重複添加的錯誤
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '此商品已在收藏列表中' });
    }
    
    res.status(500).json({ message: err.message });
  }
};


