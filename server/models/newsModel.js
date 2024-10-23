// Author: zhier1114
const db = require('./dbConnect')


// 嘻哈專欄

// 列表
exports.getAllNews = async () => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT n.newsId, n.newsType, n.newsTitle, n.coverImg, n.newsContent, n.newsAuthor, n.createdAt, n.newsStatus FROM News AS n ORDER BY n.createdAt DESC',
        (error, results) => {
          if (error) {
            console.error('取得嘻哈專欄錯誤:', error)
            reject(error)
          } else {
            resolve(results)
          }
        }
      )
    })
  }
  // 內容
  exports.getNewsDetail = async (newsId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM News AS n WHERE n.newsId = ?', [newsId], (error, results) => {
        if (error) {
          console.error('取得文章內容錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }