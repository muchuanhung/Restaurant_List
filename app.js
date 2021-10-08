// app.js
// require packages used in the project
const express = require('express')
//載入外部資料json檔案
const restaurantList = require ('./restaurant.json')
const app = express()
const port = 3000

// require handlebars in the project(模板引擎)
const exphbs =  require('express-handlebars')
//express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set ('view engine', 'handlebars')


// setting static files 設定Express路由以提供靜態檔案
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
   
// past the restaurant data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results });
})


//定義搜尋引擎路由
//優化使用者體驗-大小寫都搜得到
app.get('/search', (req, res) => {
  const keywords = req.query.keyword
  let showErrorMsg = false
    //filter函數
  const searchResults = restaurantList.results.filter(restaurant => {
    // 可從名字、英文名字、種類來搜尋餐廳
    if (
      restaurant.name.toLowerCase().includes(keywords.toLowerCase()) ||
      restaurant.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
      restaurant.category.includes(keywords)
    )
      return restaurant
  })

  // notify result not found
  if (searchResults.length === 0) {
    showErrorMsg = true
  } 

  res.render('index', {restaurants: searchResults, keyword: keywords, showErrorMsg})
})

//用find取代filter
app.get('/restaurants/:id', (req, res) => {
  const selectedRestaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', {restaurant: selectedRestaurant})
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})