const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const seed = restaurantList.results

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.deleteMany() // 清空舊資料
    .then(() => Restaurant.create(seed)) // 插入 JSON 資料
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close() // 關閉資料庫連線
    })
    .catch(error => console.log(error))
})
