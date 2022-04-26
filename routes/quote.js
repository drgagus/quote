const express   = require('express')
const router    = express.Router()
const {index,create,store,show,edit,update,destroy} = require('./../controllers/quote')

router.get('/', index)
router.get('/create', create)
router.post('/create', store)
router.get('/:id/edit', edit)
router.put('/:id/edit', update)
router.get('/:id', show)
router.delete('/:id', destroy)

module.exports = router