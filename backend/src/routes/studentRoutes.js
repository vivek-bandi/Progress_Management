const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');

router.get('/',studentCtrl.getAll);
router.post('/',studentCtrl.add);
router.put('/:id',studentCtrl.update);
router.delete('/:id',studentCtrl.delete);
router.get('/:id/profile',studentCtrl.getStudentProfile);
router.post('/:id/sync',studentCtrl.sync);


module.exports = router;