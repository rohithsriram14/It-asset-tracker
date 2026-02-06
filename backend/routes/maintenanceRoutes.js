const express = require('express');
const {
    addMaintenance,
    closeMaintenance,
    getMaintenanceRecords,
    getAssetMaintenance
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .post(addMaintenance)
    .get(getMaintenanceRecords);

router.put('/:id/close', closeMaintenance);
router.get('/:assetId', getAssetMaintenance);

module.exports = router;
