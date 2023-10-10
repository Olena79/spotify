// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  veryfyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: { list, isEmpty: list.length === 0 },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/success-info', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/success-info', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.veryfyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================
// ================================================================
// ================================================================
// ================================================================
// ================================================================

// ================================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()

  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

class Product {
  static #list = []
  id

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date().toISOString()
    this.id = Math.floor(Math.random() * 90000) + 10000
    Product.#list.push(this)
  }

  static getList = () => Product.#list

  static add = (product) => {
    Product.#list.push(product)
  }

  static getById = (id) => {
    Product.#list.find((product) => product.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    } else if (price) {
      product.price = price
    } else if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = Product.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      Product.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

//========

const myProducts = [
  new Product(
    'Стильна сукня',
    '1500₴',
    'Елегантна сукня з натуральної тканини для особливих випадків.',
    '93856',
    // uniqueId(),
  ),
  new Product(
    'Спортивні кросівки',
    '1200₴',
    'Зручні та стильні кросівки для активного способу життя..',
    '93215',
    // uniqueId(),
  ),
  new Product(
    'Сонячні окуляри',
    '800₴',
    'Модні окуляри з високоякісними лінзами для захисту очей від сонця.',
    '75378',
    // uniqueId(),
  ),
  new Product(
    'Чоловічий годинник',
    '2500₴',
    'Елегантний годинник з механічним механізмом і сталевим браслетом.',
    '46789',
    // uniqueId(),
  ),
  new Product(
    'Жіночий рюкзак',
    '900₴',
    'Стильний рюкзак з великим відділенням та кишенями.',
    '76543',
    // uniqueId(),
  ),
  new Product(
    'Парасолька',
    '350₴',
    'Компактна парасолька з автоматичним механізмом.',
    '48596',
    // uniqueId(),
  ),
  new Product(
    'Столові прибори',
    '600₴',
    'Набір столових приборів зі сталі, виготовлені в класичному стилі.',
    '29875',
    // uniqueId(),
  ),
  new Product(
    'Шкіряний гаманець',
    '400₴',
    'Елегантний гаманець з натуральної шкіри з багатьма відділеннями.',
    '39845',
    // uniqueId(),
  ),
  new Product(
    'Спортивні кросівки',
    '700₴',
    "Браслет для відстеження активності та здоров'я.",
    '10985',
    // uniqueId(),
  ),
]

myProducts.forEach((product) => {
  Product.add(product)
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно був створений',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const productList = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    productList: productList,
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
