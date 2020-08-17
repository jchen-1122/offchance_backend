const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const raffleRoutes = require('./routes/raffleRoutes')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use('/user', userRoutes)
app.use('/raffle', raffleRoutes)

// io.on('connection', (socket) => {
//     socket.on('message', message => {
//         console.log(message)
//         io.emit('message', message)
//     })
//     socket.on('broadcast', message => {
//         socket.broadcast.emit('message', message);
//     })
// })

const url = 'mongodb://ibm_cloud_d01aeb6f_191a_48c0_9ab8_683c02164d70:92b7e059e6468245eae1542cc66fac2723d861756aafe275aef66ad046bca733@ff5c31b5-6bef-4d62-9ac1-22a50b31eeb8-0.bn2a2vgd01r3l0hfmvc0.databases.appdomain.cloud:32697/?authSource=admin&replicaSet=replset&readPreference=primaryPreferred&appname=MongoDB%20Compass&ssl=true'

mongoose.connect(url, () => {
    console.log('connected to db')
})

server.listen(3000)    