// Author: zhier1114
require('dotenv').config({ path: '../config.env' })
const app = require('./app')
const PORT = process.env.PORT || 3000

// const { connectToServer, closeConnection } = require('./models/mongoDB')

// const startServer = async () => {
//   try {
//     await connectToServer()

//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`)
//     })
//   } catch (err) {
//     console.error('Failed to start server:', err)
//   }
// }

// startServer()

// // 在應用關閉時斷開數據庫連接
// process.on('SIGINT', async () => {
//   await closeConnection()
//   process.exit()
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
