const express = require('express');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isPackageManager, validatePackage } = require('../middleware');

const packagesController = require('../controllers/packages');
const catchAsync = require('../utils/catchAsync');


//all packages
router.route('/')
    .get(isLoggedIn, catchAsync(packagesController.index))
    .post(isLoggedIn, validatePackage, catchAsync(packagesController.createPackage));

//show package
router.route('/:id')
    .get(catchAsync(packagesController.showPackage))
    .put(isLoggedIn, isPackageManager, validatePackage, catchAsync(packagesController.updatePackage));

//edit package
router.get('/:id/edit', isLoggedIn, catchAsync(packagesController.renderEditForm));

//delete package
router.delete('/:packageID', isLoggedIn, isPackageManager, catchAsync(packagesController.deletePackage));

module.exports = router;