const express = require('express');
const router = express.Router();
const {saveCameraAnalysis} = require('../controllers/camera.controller');
const {verifyToken} = require('../middleware/auth.middleware');

router.use(verifyToken);
router.post('/', saveCameraAnalysis);

module.exports = router;