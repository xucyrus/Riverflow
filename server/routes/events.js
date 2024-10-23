//Author: YuFu
const express = require('express')
const router = express.Router()


// 解構取得函式
const {
  getAllEvents,
  getEventsById,
  createEvents,
  updateEvents,
  deleteEvents,
} = require('../controllers/eventController')

//新增活動
router.post('/', createEvents)
//更新活動
router.put('/:id', updateEvents)
//刪除活動
router.delete('/:id', deleteEvents)
//取全部活動
router.get('/', getAllEvents)
//取單個活動
router.get('/:id', getEventsById)

module.exports = router
