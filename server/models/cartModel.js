//Author: YuFu
const dbconnect = require('./dbConnect')

// 將 query 轉換為 Promise
const queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    dbconnect.query(sql, params, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}


// 新增到購物車
exports.addToCart = (userId, productId, quantity, productName, productOpt, price) => {
  let cartId
  return queryPromise('SELECT cartId FROM cart WHERE userId = ?', [userId])
    .then((cartResult) => {
      if (cartResult.length === 0) {
        return queryPromise('INSERT INTO cart (userId) VALUES (?)', [userId]).then((newCart) => {
          cartId = newCart.insertId
          console.log('Created new cart with ID:', cartId)
          return cartId
        })
      } else {
        cartId = cartResult[0].cartId
        console.log('Found existing cart with ID:', cartId)
        return cartId
      }
    })
    .then(() => {
      return queryPromise('SELECT ciid FROM cartitem WHERE cartId = ? AND productId = ? AND productOpt = ?', [
        cartId,
        productId,
        productOpt
      ])
    })
    .then((existingItem) => {
      if (existingItem.length > 0) {
        console.log('Found existing item:', existingItem[0])
        return queryPromise('UPDATE cartitem SET quantity = quantity + ? WHERE ciid = ?', [
          quantity,
          existingItem[0].ciid
        ]).then(() => ({ success: true, cartItemId: existingItem[0].ciid }))
      } else {
        console.log('Inserting new item:', { cartId, productId, productName, productOpt, quantity, price })
        return queryPromise(
          'INSERT INTO cartitem (cartId, productId, productName, productOpt, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
          [cartId, productId, productName, productOpt, quantity, price]
        ).then((result) => ({ success: true, cartItemId: result.insertId }))
      }
    })
    .catch((error) => {
      console.error('Error in addToCart:', error)
      throw error
    })
}


// 取得購物車內容
exports.getCart = (userId) => {
  return queryPromise('SELECT cartId FROM cart WHERE userId = ?', [userId])
    .then((cartResult) => {
      if (cartResult.length === 0) {
        return []
      }
      const cartId = cartResult[0].cartId
      return queryPromise(
        `SELECT ci.ciid, ci.productId, ci.productName, ci.productOpt, ci.quantity, ci.price, MIN(pi.productImg) as productImg
         FROM cartitem ci
         JOIN ProductImages pi ON ci.productId = pi.productId
         WHERE ci.cartId = ?
         GROUP BY ci.ciid, ci.productId, ci.productName, ci.productOpt, ci.quantity, ci.price`,
        [cartId]
      )
    })
    .catch((error) => {
      console.error('Error in getCart:', error)
      throw error
    })
}


//更新購物車數量
exports.updateCartItem = (ciid, quantity) => {
  return queryPromise('UPDATE cartitem SET quantity = ? WHERE ciid = ?', [quantity, ciid])
    .then(() => ({ success: true }))
    .catch((error) => {
      console.error('Error in updateCartItem:', error)
      throw error
    })
}


//刪除購物車項目
exports.removeFromCart = (ciid) => {
  return queryPromise('DELETE FROM cartitem WHERE ciid = ?', [ciid])
    .then(() => ({ success: true }))
    .catch((error) => {
      console.error('Error in removeFromCart:', error)
      throw error
    })
}
