const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

router.post('/update-time', cronController.updateTime);
router.get('/current-time', cronController.getCurrentTime);

module.exports = router;