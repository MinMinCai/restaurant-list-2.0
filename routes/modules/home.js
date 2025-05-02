const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant') // 引用 restaurant model

router.get('/', (req, res) => {
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

module.exports = router