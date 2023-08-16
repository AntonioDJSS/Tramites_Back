const { Router } = require("express")

const  { generarPdf }  = require('../controllers/pdfController')

const router = Router();

router.post('/:id', generarPdf );



module.exports = router;
