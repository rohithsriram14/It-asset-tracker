const express = require('express');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
