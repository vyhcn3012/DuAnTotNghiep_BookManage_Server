const CPanelController = require('../../controllers/CPanelController')
const AuthCotroller = require('../../controllers/AuthCotroller')
const express = require( 'express' ), router = express.Router();


router.get('/', CPanelController.index )
router.post( '/', CPanelController.auth );
router.get( '/auth_callback', CPanelController.callback );
router.get('/index', AuthCotroller.checkLogin, AuthCotroller.cpanel_index);
module.exports = router;
