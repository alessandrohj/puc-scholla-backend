import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'

const router = express.Router()


router.get('/users/me', async (req, res) => {
    //Route in testing mode with DB.
    //Need to implement proper authentication
    const user = await User.findOne({email: req.body.email}).where('password', req.body.password)
    if (user) {
        res.status(200).send({message: 'found user'})
    } else {
        res.status(404).send({message: 'user not found'})
    }

})
router.post('/users', sanitizeBody, async (req, res, next) => {
    new User(req.sanitizedBody)
    .save()
    .then((newUser) => res.status(201).send({message: 'New user created', data: newUser}))
    .catch(next)
})

export default router