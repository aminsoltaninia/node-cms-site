const express = require('express');
const router = express.Router();

// 2ta file Home,js admin.js ro to in file moarefi mikonim

//admin router
const adminRouter = require('./admin');
router.use('/admin',adminRouter);

// home router
const homeRouter = require('./home');
router.use('/',homeRouter);











module.exports = router;