const express = require('express');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isStoreManager, validateStore } = require('../middleware');

const storesController = require('../controllers/stores');

const catchAsync = require('../utils/catchAsync');

//all stores
router.route('/')
    .get(catchAsync(storesController.index))
    .post(isLoggedIn, validateStore, catchAsync(storesController.createStore));

//show store
router.route('/:id')
    .get(catchAsync(storesController.showStore))
    .put(isLoggedIn, isStoreManager, validateStore, catchAsync(storesController.updateStore));

//edit store
router.get('/:id/edit', isLoggedIn, catchAsync(storesController.renderEditForm));

//delete store
router.delete('/:storeID', isLoggedIn, isStoreManager, catchAsync(storesController.deleteStore));

module.exports = router;