if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
//const bodyParser = require('body-parser')

app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

//Routing Info
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
app.use('/', indexRouter)
app.use('/authors',authorRouter)

//Database Info
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000)