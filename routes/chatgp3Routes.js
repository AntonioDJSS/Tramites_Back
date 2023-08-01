const { Router } = require('express');
const {chatgp3} = require('../controllers/chatgp3Controller')

const router = Router();

router.post('/chat', chatgp3 )



module.exports = router;