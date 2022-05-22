const CPanelController = require('../../controllers/CPanelCotroller')
const express = require('express')
router = express.Router()

router.get('/', CPanelController.index)

module.exports = router
