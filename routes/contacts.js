const express = require('express');
const router = express.Router();

//contacts page

router.get('/', (req, res) => {
    res.render('contacts')
})

module.exports = router;