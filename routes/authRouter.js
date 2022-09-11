import express from 'express'

const router = express.Router()


router.get('/users/me', async (req, res) => {
    res.send({data: 'Working'})
})
router.post('/users', async (req, res) => {
    res.send({data: 'Working'})
})

export default router