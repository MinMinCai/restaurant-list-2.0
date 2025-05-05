const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const restaurantList = require('../../restaurant.json')

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword) || 
               restaurant.category.toLowerCase().includes(keyword)
      })
      res.render('index', { restaurants: filteredRestaurants, keyword: keyword })
    })
    .catch(error => console.log(error))
})

router.get('/new', (req, res) => {
    return res.render('new')
})

// 取出 req.body.name 的 name 資料，並將其存入 MongoDB 的資料庫中
router.post('/', (req, res) => {
    return Restaurant.create(req.body) // 將整個 req.body 傳入
        .then(() => res.redirect('/')) // 成功後重新導向首頁
        .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findByIdAndUpdate(id, req.body) // 更新資料
        .then(() => res.redirect('/')) // 更新後重新導向首頁
        .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .then((restaurant) => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router