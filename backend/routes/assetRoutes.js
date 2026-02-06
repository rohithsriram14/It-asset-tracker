const express = require('express');
const {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset,
    getMyAssets
} = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public/Employee routes
router.get('/my-assets', protect, getMyAssets);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(getAssets)
    .post(createAsset);

router
    .route('/:id')
    .get(getAsset)
    .put(updateAsset)
    .delete(deleteAsset);

module.exports = router;
