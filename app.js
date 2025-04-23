const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

const mongoose = require('mongoose')
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

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(
    restaurant => restaurant.id.toString() === req.params.id
  )
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const filteredRestaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants: filteredRestaurants, keyword: keyword})
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})