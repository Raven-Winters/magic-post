const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isWarehouseManager, validateWarehouse } = require('../middleware');

const warehousesController = require('../controllers/warehouses');

//all warehouses
router.route('/')
    .get(isLoggedIn, catchAsync(warehousesController.index))
    .post(isLoggedIn, validateWarehouse, catchAsync(warehousesController.createWarehouse));

//create warehouse
router.get('/new', isLoggedIn, warehousesController.renderNewForm);

//show warehouse
router.route('/:id')
    .get(isLoggedIn, catchAsync(warehousesController.showWarehouse))
    .put(isLoggedIn, isWarehouseManager, validateWarehouse, catchAsync(warehousesController.updateWarehouse))
    .delete(isLoggedIn, isWarehouseManager, catchAsync(warehousesController.deleteWarehouse));

//edit warehouse
router.get('/:id/edit', isLoggedIn, isWarehouseManager, catchAsync(warehousesController.renderEditForm));

module.exports = router;