const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
const restaurant = require('./models/restaurant')
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
})

// 設定 Handlebars 輔助函數
const hbs = exphbs.create({
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
    }
  }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// 取出 Restaurant model 的所有資料，並把 MongoDB 的資料庫資料傳給 index.handlebars 
app.get('/', (req, res) => {
  const sortOption = req.query.sort
  let sortCriteria = {}

  if (sortOption === 'A-Z') {
    sortCriteria = { name: 'asc' }
  }
  else if (sortOption === 'Z-A') {
    sortCriteria = { name: 'desc' }
  }
  else if (sortOption === '類別') {
    sortCriteria = { category: 'asc' }
  }
  else if (sortOption === '評分') {
    sortCriteria = { rating: 'desc' }
  }

  Restaurant.find()
    .lean()
    .sort(sortCriteria)
    .then(restaurants => res.render('index', { 
      restaurants, 
      sortOption,
      isDefaultSort: !sortOption 
    }))
    .catch(error => console.log(error))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 取出 req.body.name 的 name 資料，並將其存入 MongoDB 的資料庫中
app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body) // 將整個 req.body 傳入
    .then(() => res.redirect('/')) // 成功後重新導向首頁
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByIdAndUpdate(id, req.body) // 更新資料
    .then(() => res.redirect('/')) // 更新後重新導向首頁
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})





