//Author: YuFu
const dbConnect = require('./dbConnect')


// 取得所有活動
exports.getAllEvents = () => {
  return new Promise((resolve, reject) => {
    dbConnect.query(
      `
      SELECT * FROM events
      `, (err, events) => {
      if (err) return reject(err)
      resolve(events)
    })
  })
}

// 取得單個活動
exports.getEvents = (id) => {
  return new Promise((resolve, reject) => {
    dbConnect.query(`
    SELECT * FROM events WHERE eventId = ?

      `, [id], (err, event) => {
      if (err) return reject(err)
      resolve(event)
      // res.send(event)
    })
  })
}

// 新增活動
exports.createEvents = (eventData) => {
  return new Promise((resolve, reject) => {
    dbConnect.query('INSERT INTO events SET ?', eventData, (err, result) => {
      if (err) return reject(err)
      resolve({ message: 'events created', id: result.insertId })
    })
  })
}

// 更新活動
exports.updateEvents = (id, eventData) => {
  return new Promise((resolve, reject) => {
    dbConnect.query('UPDATE events SET ? WHERE eventid = ?', [eventData, id], (err, result) => {
      if (err) return reject(err)
      resolve({ message: 'events updated', changed: result.changedRows })
    })
  })
}

// 刪除活動
exports.deleteEvents = (id) => {
  return new Promise((resolve, reject) => {
    dbConnect.query('DELETE FROM events WHERE eventid = ?', [id], (err, result) => {
      if (err) return reject(err)
      resolve({ message: 'events deleted', deleted: result.affectedRows })
    })
  })
}

