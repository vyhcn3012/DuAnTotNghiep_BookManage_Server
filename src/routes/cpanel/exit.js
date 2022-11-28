const CPanelController = require('../../controllers/CPanelController');
const express = require('express'),
    router = express.Router();

router.get('/', CPanelController.exit);
module.exports = router;
