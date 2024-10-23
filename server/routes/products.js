//Author: YuFu
const express = require('express')
const router = express.Router()

// 解構取得函式
const {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  removeFavoriteProduct
} = require('../controllers/productController')

// 新增
router.post('/', createProduct)
// 更新
router.put('/:id', updateProduct)
// 刪除
router.delete('/:id', deleteProduct)
//取得
router.get('/', getAllProducts)
// 根據ID獲取產品
router.get('/:id', getProductById)

module.exports = router
