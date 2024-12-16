const express = require('express');
const multer = require('multer');
const excelController = require('../controllers/excelController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/template', excelController.createTemplate);
router.get('/template-filled', excelController.createTemplateFilled);
router.post('/upload', upload.single('file'), excelController.uploadTemplate);

module.exports = router;