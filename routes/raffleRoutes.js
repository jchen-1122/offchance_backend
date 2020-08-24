const express = require('express')
const Raffle = require('../models/Raffle')
const router = express.Router()
const AWS = require('aws-sdk');

/*
* New raffle posted by verified accounts
* approved and archived false by default
*/

// ibm done
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
// ibm done
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
// ibm done
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
// ibm done
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
// ibm done
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

// Delete image from ibm cloud, used before raffle is deleted.

AWS.config = new AWS.Config({
    accessKeyId: "da62c56fb48940a7aada0c86062cf9a6",
    secretAccessKey: "34b18fbbeb724fe1e06a8e0d0210cd65f7f690db566eb1d6",
    endpoint: 's3.us-east.cloud-object-storage.appdomain.cloud',
    region: 'us-east-standard'
});

const cosClient = new AWS.S3();

const _delImage = (itemNames, bucketName) => {

    var deleteRequest = {
        "Objects": itemNames      
    }
    return cosClient.deleteObjects({
        Bucket: bucketName,
        Delete: deleteRequest
    }).promise()
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
};

// Delete by id
// ibm
router.delete('/del/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await Raffle.findOneAndDelete({
            _id
        })
        if (!user) {
            return res.status(400).send({error: 'Document not found (Raffle Delete)'})
        }
        let imgArr = []
        user.images.forEach(element => {
            imgArr.push({"Key": element.substring(element.lastIndexOf('/') + 1)})
        })
        let charArr = []
        user.charityImgs.forEach(element => {
            charArr.push({"Key": element.substring(element.lastIndexOf('/') + 1)})
        })
        //console.log(imgArr)
        _delImage(imgArr, 'oc-drawing-images')
        _delImage(charArr, 'oc-charity-images')
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// ibm done

router.post('/win/:id', async (req, res) => {
    const _id = req.params.id
    try {
        let raffle = await Raffle.findOne({
            _id
        })
        if (!raffle) {
            return res.status(400).send({error: 'Document not found (Set Raffle Winner)'})
        }

        // if winners exist, return
        if (raffle.winners.children.length !== 0) {
            console.log('winners already determined')
            res.send(raffle)
            return
        }

        // donate to enter only
        // rewards based on amount donated per person
        const breakdown = {
            5: [1,3],
            10: 5,
            20: 10,
            50: [15,25, 40],
            100: 50,
            250: 100
        }
        const levels = Object.keys(breakdown)
        let rewards = []
        let winners = []

        raffle.users.children.forEach((entry) => {
            var i = 0;
            while (entry.amountDonated >= levels[i] && i < levels.length) {
                i++;
            }
            // i-1 is the floor (largest greater than or equal to amountDonated)
            i = i - 1;
            // 0.6 for 1, 0.4 for 3
            if (i === 0) {
                const rand = Math.random();
                if (rand <= 0.6) {
                    rewards.push(1);
                } else {
                    rewards.push(3);
                }
            } 
            // 0.6 for 15, 0.3 for 25, 0.1 for 40
            else if (i === 3) {
                const rand = Math.random();
                if (rand <= 0.6) {
                    rewards.push(15);
                } else if (rand > 0.6 && rand <= 0.9) {
                    rewards.push(25);
                } else {
                    rewards.push(40)
                }
            } else {
                rewards.push(breakdown[levels[i]]);
            }
        })  

        // replace one reward with 101 (grand prize)
        let deleteID = Math.floor(Math.random() * rewards.length);   
        rewards[deleteID] = 101

        // randomly and proportionally assign rewards to entered users
        rewards = rewards.sort((a,b) => b-a)
        let rewardIndex = 0;
        
        // winner algorithm
        const enteredUsers = raffle.users.children.slice()
        while (rewardIndex < rewards.length) {
            // 1. assign everyone a range of numbers based on the number of chances
            let ranges = {}
            let count = 1
            let numChances = 0
            for (var i = 0; i < enteredUsers.length; i++) {
                ranges[enteredUsers[i].userID] = [count, count + enteredUsers[i].chances - 1]
                count += enteredUsers[i].chances
                numChances += enteredUsers[i].chances
            }
            
            // 2. Generate a random number from 0 to numChances
            const rand = Math.floor((Math.random() * numChances) + 1)

            // 3. determine who's range qualifies (both ends inclusive)
            let winner = -1
            for (var i = 0; i < enteredUsers.length; i++) {
                if (ranges[enteredUsers[i].userID][0] <= rand && ranges[enteredUsers[i].userID][1] >= rand) {
                    winner = enteredUsers[i].userID
                    winners.push({ userID: enteredUsers[i].userID, reward: rewards[rewardIndex] })
                    break
                }
            }
            
            // 4. update variables for next loop
            rewardIndex++;

            // 5. delete current winner from array
            for (var i = enteredUsers.length - 1; i >= 0; i--) {
                if (enteredUsers[i].userID === winner) {
                    // console.log('deleted')
                    enteredUsers.splice(i, 1);
                    break
                }
            }
        }
        raffle.winners.children = winners
        await raffle.save()
        
        res.send(raffle)
    } catch (e) {
        res.status(404).send(e)
    }   
})


// ibm done
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