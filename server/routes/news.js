// Author: zhier1114
const express = require('express')
const router = express.Router()
const newsController = require('../controllers/newsController')

// 嘻哈專欄

// 列表
router.get('/news', newsController.getAllNews)

// 詳細內容
router.get('/news/:newsId', newsController.getNewsDetail)

module.exports = router