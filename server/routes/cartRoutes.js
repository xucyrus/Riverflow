//Author: YuFu
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

//新增購物車
router.post('/add', cartController.addToCart);
//取得購物車
router.get('/', cartController.getCart);
//更新購物車項目
router.put('/update', cartController.updateCartItem);
//刪除購物車項目
router.delete('/remove/:ciid', cartController.removeFromCart);

module.exports = router;