// Author: zhier1114
const newsModel = require('../models/newsModel')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// 嘻哈專欄

// 列表
exports.getAllNews = async (req, res) => {
    try {
      const allNews = await newsModel.getAllNews()
      res.json(allNews)
    } catch (err) {
      console.error('文章取得失敗：', err)
      res.status(500).json({ message: err.message })
    }
  }
  // 詳細內容
  exports.getNewsDetail = async (req, res) => {
    try {
      const newsDetail = await newsModel.getNewsDetail(req.params.newsId)
      res.json(newsDetail)
    } catch (err) {
      console.error('文章取得失敗：', err)
      res.status(500).json({ message: err.message })
    }
  }