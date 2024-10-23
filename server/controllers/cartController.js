//Author: YuFu
const cartModel = require('../models/cartModel')

//加入購物車
exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId
    const { productId, quantity, productName, productOpt, price } = req.body
    const result = await cartModel.addToCart(userId, productId, quantity, productName, productOpt, price)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//取得購物車
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId
    const cart = await cartModel.getCart(userId)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//更新購物車數量
exports.updateCartItem = async (req, res) => {
  try {
    const { ciid, quantity } = req.body
    const result = await cartModel.updateCartItem(ciid, quantity)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//刪除購物車項目
exports.removeFromCart = async (req, res) => {
  try {
    const { ciid } = req.params
    const result = await cartModel.removeFromCart(ciid)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
