const express = require('express')
const Raffle = require('../models/Raffle')
const router = express.Router()

/*
* New raffle posted by verified accounts
* approved and archived false by default
*/

router.post('/new', (req, res) => {
    const raffle = {}
    Object.keys(req.body).forEach(el => {
        raffle[el] = req.body[el]
    })
    const r = new Raffle(raffle)
    r.save()
    .then(data => {
        console.log(data)
        res.json(data)
    }).catch(e => {
        console.log(e)
        res.json({message: 'error'})
    })
})

// Edit raffle details
router.patch('/edit/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const _id = req.params.id
    try {
        let user = await Raffle.findOne({
            _id
        })
        if (!user) {
            return res.status(400).send({error: 'Document not found (Edit Raffle)'})
        }
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }   
})

// Get all raffles
router.get('/all', async (req, res) => {
    try {
        const all = await Raffle.find({})
        if (!all) {
            return res.status(400).send({error: 'Document not found (No Raffles)'})
        }
        res.send(all)
    } catch (e) {
        res.status(500).send()
    }
})

// Search by raffle name
router.get('/name/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await Raffle.find({
            "name": _id
        })
        if (!user) {
            return res.status(400).send({error: 'Document not found (Raffle Name Search)'})
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// Search by id
router.get('/id/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await Raffle.findOne({
            _id
        })
        if (!user) {
            return res.status(400).send({error: 'Document not found (Raffle ID Search)'})
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// Delete by id
router.delete('/del/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await Raffle.findOneAndDelete({
            _id
        })
        if (!user) {
            return res.status(400).send({error: 'Document not found (Raffle Delete)'})
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/win/:id', async (req, res) => {
    const _id = req.params.id
    try {
        let raffle = await Raffle.findOne({
            _id
        })
        if (!raffle) {
            return res.status(400).send({error: 'Document not found (Set Raffle Winner)'})
        }
        //updates.forEach((update) => {
        //    raffle[update] = req.body[update]
        //})
        let winArr = []
        var count = 0
        raffle.users.children.forEach((enter) => {
            //console.log(enter)
            winArr.push({
                userID: enter.userID,
                reward: count
            })
            if (count < 3) count++
        })
        raffle.winners.children = winArr
        await raffle.save()
        
        res.send(raffle)
    } catch (e) {
        res.status(404).send(e)
    }   
})


router.get('/query', async (req, res) => {
    try {
        const query = req.query.query
        const dir = req.query.dir
        const val = req.query.val
        const limit = req.query.limit

        const obj = {}

        if (val) {
            obj[query] = val
            const raffles = await Raffle.find(obj).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(raffles)
        } else if (dir) {
            obj[query] = (dir === 'asc') ? 1 : -1
            const raffles = await Raffle.find({}).sort(obj).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(raffles)
        } else {
            const raffles = await Raffle.find({}).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(raffles)
        }
    } catch (e) {
        res.status(500).send({message: 'invalid query params'})
    }
    
})


module.exports = router