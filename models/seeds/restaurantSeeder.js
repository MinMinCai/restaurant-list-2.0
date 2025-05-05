const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const restaurantList = require('../../restaurant.json')
const seed = restaurantList.results

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.once('open', () => {
  Restaurant.deleteMany() // 清空舊資料
    .then(() => Restaurant.create(seed)) // 插入 JSON 資料
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close() // 關閉資料庫連線
    })
    .catch(error => console.log(error))
})
