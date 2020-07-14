const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use('/signup', userRoutes)

const url = 'mongodb://ibm_cloud_d01aeb6f_191a_48c0_9ab8_683c02164d70:92b7e059e6468245eae1542cc66fac2723d861756aafe275aef66ad046bca733@ff5c31b5-6bef-4d62-9ac1-22a50b31eeb8-0.bn2a2vgd01r3l0hfmvc0.databases.appdomain.cloud:32697/?authSource=admin&replicaSet=replset&readPreference=primaryPreferred&appname=MongoDB%20Compass&ssl=true'

mongoose.connect(url, () => {
    console.log('connected to db')
})

app.listen(3000)