const express = require('express');
const {
    assignAsset,
    transferAsset,
    returnAsset,
    getAssetHistory,
    getMyHistory
} = require('../controllers/allocationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/my-history', protect, getMyHistory);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/assign', assignAsset);
router.post('/transfer', transferAsset);
router.post('/return', returnAsset);
router.get('/history/:assetId', getAssetHistory);

module.exports = router;
