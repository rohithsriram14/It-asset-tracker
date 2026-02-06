const express = require('express');
const {
    getInventoryReport,
    getWarrantyReport,
    getMaintenanceReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/inventory', getInventoryReport);
router.get('/warranty-expiry', getWarrantyReport);
router.get('/maintenance-due', getMaintenanceReport);

module.exports = router;
