// Author: zhier1114
const db = require('./dbConnect')
const util = require('util')

// 管理者登入：確認帳號密碼
exports.findAccount = async (account) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Administrators WHERE account = ?', [account], (error, results) => {
      if (error) {
        console.error('查詢用戶錯誤:', error)
        return reject(error)
      }
      resolve(results.length > 0 ? results[0] : null)
    })
  })
}

// 商品

// 列表
exports.getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.productId, p.productName, p.productPrice, p.productStatus, p.productOpt, pi.productImg FROM products AS p 
        LEFT JOIN (SELECT productId, MIN(productImg) as productImg FROM ProductImages GROUP BY productId) 
        pi ON p.productId = pi.productId`,
      (error, results) => {
        if (error) {
          console.error('取得所有商品資訊失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 類別
exports.getProductCategories = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT ProductCategories.productId, Categories.categoryName FROM ProductCategories, Categories WHERE ProductCategories.categoryId = Categories.categoryId ORDER BY ProductCategories.productId',
      (error, results) => {
        if (error) {
          console.error('取得所有分類失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 詳細內容
exports.getProductDetail = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM products AS p WHERE p.productId = ?', [productId], (error, results) => {
      if (error) {
        console.error('取得商品詳細內容失敗:', error)
        reject(error)
      } else {
        resolve(results[0])
      }
    })
  })
}
// 單一類別
exports.getOneProductCategory = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT c.categoryName FROM ProductCategories AS pc, Categories AS c WHERE pc.productId = ? AND pc.categoryId = c.categoryId',
      [productId],
      (error, results) => {
        if (error) {
          console.error('取得單一商品類別失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 圖片
exports.getProductImages = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM ProductImages WHERE productId =?', [productId], (error, results) => {
      if (error) {
        console.error('取得商品��片失��:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 下架
exports.removeProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE Products SET productStatus = 'Discontinued' WHERE productId = ?",
      [productId],
      (error, results) => {
        if (error) {
          console.error('下架商品失敗:', error)
          reject(error)
        } else {
          resolve(results.affectedRows > 0)
        }
      }
    )
  })
}
// 上架
exports.launchProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE Products SET productStatus = 'Available' WHERE productId = ?", [productId], (error, results) => {
      if (error) {
        console.error('上架商品失敗:', error)
        reject(error)
      } else {
        resolve(results.affectedRows > 0)
      }
    })
  })
}
// 搜尋
exports.searchProducts = async (keyword) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT pi.productImg, p.productId, p.productName, p.productPrice, p.productStatus FROM products AS p 
      LEFT JOIN (SELECT productId, MIN(productImg) as productImg FROM ProductImages GROUP BY productId) pi 
      ON p.productId = pi.productId WHERE p.productName LIKE CONCAT("%", ?, "%") `,
      [keyword],
      (error, results) => {
        if (error) {
          console.error('搜尋商品失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 搜尋類別
exports.getSearchProductCategories = async (productIds) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT pc.productId, c.categoryName FROM productCategories AS pc
      JOIN categories AS c ON pc.categoryId = c.categoryId WHERE pc.productId IN (?)`,
      [productIds],
      (error, results) => {
        if (error) {
          console.error('取得分類失��:', error)
          reject(error)
        } else {
          resolve(results.length > 0 ? results[0] : null)
        }
      }
    )
  })
}
// 新增商品
exports.createProduct = async (productData) => {
  const values = [
    productData.productName,
    productData.productSpec1,
    productData.productSpec2,
    productData.productDesc,
    productData.productPrice,
    JSON.stringify(productData.productOpt),
    productData.productStatus,
    productData.launchDate,
    productData.removeDate,
    productData.discount,
    productData.discountRate,
    productData.discountStart,
    productData.discountEnd,
    productData.productRating
  ]
  const query =
    'INSERT INTO Products (productName, productSpec1, productSpec2, productDesc, productPrice, productOpt, productStatus, launchDate, removeDate, discount, discountRate, discountStart, discountEnd, productRating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const result = await db.queryAsync(query, values)
  return result.insertId
}
// 搜尋商品id
exports.searchProductId = async (productName) => {
  const query = 'SELECT productId FROM Products WHERE productName = ?'
  const results = await db.queryAsync(query, [productName])
  return results[0]
}
// 確認商品名稱有無重複
exports.searchProductName = async (productName) => {
  const query = 'SELECT productName FROM Products WHERE productName = ?'
  const results = await db.queryAsync(query, [productName])
  return results[0]
}
// 新增商品類別
exports.createProductCategories = async (productId, categoryId) => {
  const query = 'INSERT INTO ProductCategories (productId, categoryId) VALUES (?,?)'
  const result = await db.queryAsync(query, [productId, categoryId])
  return result.affectedRows > 0
}
// 新增商品圖片
exports.createProductImages = async (productId, imageUrl) => {
  const query = 'INSERT INTO ProductImages (productId, productImg) VALUES (?,?)'
  const result = await db.queryAsync(query, [productId, imageUrl])
  return result.affectedRows > 0
}
// 商品刪除
exports.deleteProduct = async (productId) => {
  const beginTransaction = util.promisify(db.beginTransaction).bind(db)
  const commit = util.promisify(db.commit).bind(db)
  const rollback = util.promisify(db.rollback).bind(db)
  let productData
  try {
    await beginTransaction()

    productData = await exports.getProductData(productId)
    await exports.performDelete(productId)

    await commit()
    return { success: true }
  } catch (err) {
    await rollback()
    console.error('刪除商品失敗：', err)

    if (productData) {
      try {
        await exports.restoreData(productData)
        return { success: false, error: err.message }
      } catch (restoreErr) {
        console.error('還原資料失敗：', restoreErr)
        throw new Error('刪除失敗，還原資料也失敗')
      }
    } else {
      throw new Error('刪除失敗，無法還原資料：' + err.message)
    }
  }
}
// 商品刪除：取得資訊
exports.getProductData = async (productId) => {
  const tables = ['ProductImages', 'ProductFavorites', 'ProductCategories', 'Products']
  const productData = {}

  for (const table of tables) {
    try {
      const results = await db.queryAsync(`SELECT * FROM ${table} WHERE productId = ?`, [productId])
      if (results.length > 0) {
        productData[table.toLowerCase()] = results
      }
    } catch (error) {
      console.error(`Error querying ${table}:`, error)
      if (table === 'Products') {
        throw new Error('商品不存在')
      }
    }
  }

  if (Object.keys(productData).length === 0) {
    throw new Error('找不到商品資訊')
  }

  return productData
}
// 商品刪除：刪除資料
exports.performDelete = async (productId) => {
  const tables = ['ProductImages', 'ProductFavorites', 'ProductCategories', 'Products']

  for (const table of tables) {
    try {
      await db.queryAsync(`DELETE FROM ${table} WHERE productId = ?`, [productId])
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      if (table === 'Products') {
        throw error
      }
    }
  }
}
// 商品刪除：復原資料
exports.restoreData = async (productData) => {
  for (const [table, data] of Object.entries(productData)) {
    if (data.length > 0) {
      const columns = Object.keys(data[0])
      const placeholders = columns.map(() => '?').join(', ')
      const values = data.map(Object.values)

      try {
        await db.queryAsync(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`, values.flat())
      } catch (error) {
        console.error(`Error restoring data to ${table}:`, error)
        throw error
      }
    }
  }
}

// 商品訂單

// 列表
exports.getAllProductOrders = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT o.orderId, CONCAT(u.firstName, "", u.lastName) AS rcptName , o.rcptPhone, o.totalPrice, o.payMethod, o.orderStatus FROM `Order` AS o, Users AS u WHERE o.userId = u.userId',
      (error, results) => {
        if (error) {
          console.error('取得所有商品資訊失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 資訊
exports.getProductOrderDetail = async (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT o.createdAt, CONCAT(u.firstName, "", u.lastName) AS userName, u.sex, u.email, u.phone, o.totalPrice, o.payMethod, o.orderStatus, o.receiptType, o.receiptInfo, o.rcptName, o.rcptPhone, o.rcptAddr, o.shipMethod, o.convAddr, o.orderRemark, o.backRemark, o.orderStatus FROM `Order` AS o LEFT JOIN Users AS u ON o.userId = u.userId WHERE o.orderId = ?',
      [orderId],
      (error, results) => {
        if (error) {
          console.error('取得商品訂單詳細資訊錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 選項
exports.getProductOrderOptions = async (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT oi.productName, oi.productOpt, oi.quantity FROM `Order` AS o, OrderItem AS oi WHERE o.orderId = oi.orderId AND o.orderId = ?',
      [orderId],
      (error, results) => {
        if (error) {
          console.error('取得商品訂單選項錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 更新
exports.updateProductOrderStatus = async (orderId, orderStatus, backRemark) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE `Order` SET orderStatus = ?, backRemark = ? WHERE orderId = ?',
      [orderStatus, backRemark, orderId],
      (error, results) => {
        if (error) {
          console.error('更新訂單狀態錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 搜尋
exports.searchProductOrders = async (searchKeywords) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT o.orderId, CONCAT(u.firstName, ' ', u.lastName) AS rcptName , o.rcptPhone, o.totalPrice, o.payMethod, o.orderStatus FROM `Order` AS o LEFT JOIN Users AS u ON o.userId = u.userId WHERE u.firstName LIKE ? OR u.lastName LIKE ? OR o.rcptPhone LIKE ? OR o.orderId LIKE ?"
    const searchPattern = `%${searchKeywords}%`
    const values = [searchPattern, searchPattern, searchPattern, searchPattern]
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('商品訂單搜尋錯誤:', err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 嘻哈專欄

// 列表
exports.getAllNews = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT n.newsId, n.newsType, n.newsTitle, n.newsAuthor, n.createdAt, n.newsStatus FROM News AS n ORDER BY n.createdAt DESC',
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
// 下架
exports.removeNews = async (newsId) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE News SET newsStatus = 0 WHERE newsId = ?', [newsId], (error, results) => {
      if (error) {
        console.error('下架文章錯誤:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 上架
exports.launchNews = async (newsId) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE News SET newsStatus = 1 WHERE newsId = ?', [newsId], (error, results) => {
      if (error) {
        console.error('上架文章錯誤:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 編輯
exports.updateNews = async (newsId, newsData) => {
  const values = [
    newsData.newsType,
    newsData.newsTitle,
    newsData.coverImg,
    newsData.newsContent,
    newsData.newsAuthor,
    newsData.pubTime,
    newsId
  ]
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE News SET newsType =?, newsTitle =?, coverImg =?, newsContent =?, newsAuthor =?, pubTime =? WHERE newsId =?',
      values,
      (error, results) => {
        if (error) {
          console.error('更新文章錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 搜尋
exports.searchNews = async (searchKeywords) => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM News AS n WHERE n.newsTitle LIKE ? OR n.newsType LIKE ? OR n.newsAuthor LIKE ? OR n.newsContent LIKE ?'
    const searchPattern = `%${searchKeywords}%`
    const values = [searchPattern, searchPattern, searchPattern, searchPattern]

    console.log('執行查詢:', query)
    console.log('查詢參數:', values)

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('文章搜尋錯誤:', err)
        reject(err)
      } else {
        console.log('查詢結果數量:', result.length)
        resolve(result)
      }
    })
  })
}
// 建立
exports.createNews = async (newsData) => {
  const values = [
    newsData.newsType,
    newsData.newsTitle,
    newsData.coverImg,
    newsData.newsContent,
    newsData.newsAuthor,
    newsData.pubTime,
    newsData.newsStatus
  ]
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO News (newsType, newsTitle, coverImg, newsContent, newsAuthor, pubTime, newsStatus) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      (error, results) => {
        if (error) {
          console.error('建立文章錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 刪除
exports.deleteNews = async (newsId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM News WHERE newsId = ?', [newsId], (error, results) => {
      if (error) {
        console.error('刪除文章失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

// 活動

// 列表
exports.getAllEvents = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT e.eventId, e.eventType, e.eventName, e.eventDate, e.saleDate, e.location, e.seat, e.launchStatus FROM Events AS e',
      (error, results) => {
        if (error) {
          console.error('取得活動售票錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 內容
exports.getEventDetail = async (eventId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Events AS e WHERE e.eventId =?', [eventId], (error, results) => {
      if (error) {
        console.error('取得活動內容失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 下架
exports.removeEvent = async (eventId) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Events SET launchStatus = 0 WHERE eventId = ?', [eventId], (error, results) => {
      if (error) {
        console.error('下架活動失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 上架
exports.launchEvent = async (eventId) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Events SET launchStatus = 1 WHERE eventId = ?', [eventId], (error, results) => {
      if (error) {
        console.error('上架活動失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 編輯
exports.updateEvent = async (eventId, eventData) => {
  const values = [
    eventData.eventType,
    eventData.eventName,
    eventData.coverImg,
    eventData.eventAnoc,
    eventData.eventDesc,
    eventData.eventDate,
    eventData.location,
    eventData.seat,
    eventData.ticketType,
    eventData.launchDate,
    eventData.launchStatus,
    eventData.saleDate,
    eventId
  ]
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE Events SET eventType =?, eventName =?, coverImg =?, eventAnoc =?, eventDesc =?, eventDate =?, location =?, seat =?, ticketType =?, launchDate =?, launchStatus =?, saleDate =? WHERE eventId =?',
      values,
      (error, results) => {
        if (error) {
          console.error('更新活動失敗', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 搜尋
exports.searchEvents = async (searchKeywords) => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM Events AS e WHERE e.eventName LIKE ? OR e.eventType LIKE ? OR e.eventDesc LIKE ? OR e.location LIKE ?'
    const searchPattern = `%${searchKeywords}%`
    const values = [searchPattern, searchPattern, searchPattern, searchPattern]
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('活動搜尋錯誤:', err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 新增
exports.createEvent = async (eventData) => {
  const values = [
    eventData.eventType,
    eventData.eventName,
    eventData.coverImg,
    eventData.eventAnoc,
    eventData.eventDesc,
    eventData.eventDate,
    eventData.location,
    eventData.seat,
    eventData.ticketType,
    eventData.launchDate,
    eventData.launchStatus,
    eventData.saleDate
  ]
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Events (eventType, eventName, coverImg, eventAnoc, eventDesc, eventDate, location, seat, ticketType, launchDate, launchStatus, saleDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values,
      (error, results) => {
        if (error) {
          console.error('建立活動失敗:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// // 新增圖片
// exports.createEventImages = async (eventId, eventImg, imgType) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'INSERT INTO EventImages (eventId, eventImg, imgType) VALUES (?, ?, ?) ',
//       [eventId, eventImg, imgType],
//       (error, results) => {
//         if (error) {
//           console.error('新增活動圖片失敗:', error)
//           reject(error)
//         } else {
//           resolve(results)
//         }
//       }
//     )
//   })
// }
// 刪除
exports.deleteEvent = async (eventId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Events WHERE eventId = ?', [eventId], (error, results) => {
      if (error) {
        console.error('刪除活動錯誤:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
// 刪除照片
exports.deleteEventImages = async (eventId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM EventImages WHERE eventId = ?', [eventId], (error, results) => {
      if (error) {
        console.error('刪除活動照片失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

// 活動訂單

// 列表
exports.getAllEventOrders = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT td.tdId, CONCAT(u.firstName, "", u.lastName) AS rcptName, e.eventName, td.quantity, td.tdPrice, td.tdStatus FROM TicketDetails AS td LEFT JOIN Events AS e ON td.eventId = e.eventId LEFT JOIN Users AS u ON td.userId = u.userId',
      (error, results) => {
        if (error) {
          console.error('取得活動訂單列表錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 搜尋
exports.searchEventOrders = async (searchKeywords) => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT td.tdId, CONCAT(u.firstName, "", u.lastName) AS rcptName, e.eventName, td.quantity, td.tdPrice, td.tdStatus FROM TicketDetails AS td LEFT JOIN Events AS e ON td.eventId = e.eventId LEFT JOIN Users AS u ON td.userId = u.userId WHERE e.eventName LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ?'
    const searchPattern = `%${searchKeywords}%`
    const values = [searchPattern, searchPattern, searchPattern]
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('活動訂單搜尋錯誤:', err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
// 詳細內容
exports.getEventOrderDetail = async (tdId) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT td.createdAt, CONCAT(u.firstName, "", u.lastName) AS rcptName, u.sex, u.email, u.phone, td.receiptType, td.receiptInfo, e.eventName, td.quantity, td.ticketType, td.randNum, td.tdPrice, td.tdStatus FROM TicketDetails AS td LEFT JOIN Events AS e ON td.eventId = e.eventId LEFT JOIN Users AS u ON td.userId = u.userId WHERE td.tdId = ?',
      [tdId],
      (error, results) => {
        if (error) {
          console.error('取得活動訂單詳細內容錯誤:', error)
          reject(error)
        } else {
          resolve(results)
        }
      }
    )
  })
}
// 更新狀態
exports.updateEventOrderStatus = async (tdId, tdStatus) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE TicketDetails SET tdStatus = ? WHERE tdId = ?', [tdStatus, tdId], (error, results) => {
      if (error) {
        console.error('更新活動訂單狀態失敗:', error)
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}
