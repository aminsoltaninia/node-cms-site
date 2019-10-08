const express = require('express');
const router = express.Router();

// controlers


const adminControler = require('app/http/controllers/admin/adminControler');

// admin rout
router.get('/',adminControler.index);

router.get('/course',adminControler.courses);









module.exports = router;