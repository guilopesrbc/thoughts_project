const express = require('express')
const router = express.Router()

const ToughtController = require('../controllers/ToughtController')

//helper
const checkAuth = require('../helpers/auth').checkAuth

router.get('/create', checkAuth, ToughtController.createTought)
router.post('/create', checkAuth, ToughtController.createToughtPost)
router.get('/edit/:id', checkAuth, ToughtController.editTought)
router.post('/edit', checkAuth, ToughtController.editToughtPost)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.post('/remove', checkAuth, ToughtController.removeTought)
router.get('/', ToughtController.showToughts)
module.exports = router