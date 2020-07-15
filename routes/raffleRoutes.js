const express = require('express')
const Raffle = require('../models/Raffle')
const router = express.Router()

/*
* New raffle posted by verified accounts
* approved and archived false by default
*/

router.post('/new', (req, res) => {
    const raffle = new Raffle({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        startTime: req.body.startTime,
        amountLiked: req.body.amountLiked,
        images: req.body.images,
        sizes: req.body.sizes
    })
    raffle.save()
    .then(data => {
        console.log(data)
        res.json(data)
    }).catch(e => {
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
router.get('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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


module.exports = router