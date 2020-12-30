const express = require('express')
const morgan = require('morgan') 
const mongoose = require('mongoose') 
const bodyParser = require('body-parser') 
const cors = require('cors') 
const fs = require('fs')

require('dotenv').config()
const app = express()

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
})
.then(()=>{
    console.log("[INFO] DB Connected")
})
.catch((err)=>{
    console.error("[ERROR] DB ERROR",err)
})

app.use(morgan('dev'))
app.use(bodyParser.json({limit: "2mb"}))
app.use(cors())

fs.readdirSync('./routes').map((routeFile)=>{
    app.use('/api',require('./routes/'+routeFile))
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`[INFO] Api running on PORT ${port}`)
})