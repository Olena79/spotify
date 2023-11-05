// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
