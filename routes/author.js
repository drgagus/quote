const express   = require('express')
const router    = express.Router()
const {index,create,store,show,edit,update,destroy,createQuote,storeQuote,editQuote,updateQuote,destroyQuote} = require('./../controllers/author')

router.get('/', index)
router.get('/create', create)
router.post('/create', store)
router.get('/:slug/edit', edit)
router.put('/:slug/edit', update)
router.get('/:slug', show)
router.delete('/:slug', destroy)

router.get('/:slug/quote', createQuote)
router.post('/:slug/quote', storeQuote)
router.get('/:slug/:quote/edit', editQuote)
router.put('/:slug/:quote/edit', updateQuote)
router.delete('/:slug/:quote', destroyQuote)

module.exports = router