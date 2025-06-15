const express = require('express');
const router = express.Router();
const cronCtrl = require('../controllers/cronController');

router.get('/settings',cronCtrl.getSettings);
router.put('/settings',updateSettings);

module.exports = router;