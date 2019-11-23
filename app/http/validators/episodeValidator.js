const validator = require('./validator');
const { check } = require('express-validator');
const Course = require('app/models/course');
const path = require('path');

class episodeValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({ min : 5 })
                .withMessage('فیلد تایتل نمیتواند کمتر از 5 کاراکتر باشد'),
                 
            check('type')
                .not().isEmpty()
                .withMessage('فیلد عنوان نمیتواند خالی باشد'),

            check('course')
                .not().isEmpty()
                .withMessage('فیلد دوره نمیتواند خالی باشد'),

            check('body')
                .isLength({ min : 20 })
                .withMessage('متن دوره نمیتواند کمتر از 20 کاراکتر باشد '),

            check('videoUrl')
                .not().isEmpty()
                .withMessage('لینک دانلود نمیتواند خالی باشد'),

            
            check('number')
                .not().isEmpty()
                .withMessage('شماره جلسه نمیتواند خالی باشد')
        ]
    }

  
}

module.exports = new episodeValidator();