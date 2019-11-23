const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const getDirImage = ()=>{
    let year = new Date().getFullYear();
         let month = new Date().getMonth()+1;
         let day = new Date().getDay();
         let dir = `./public/uploads/images/${year}/${month}/${day}`;
         return dir;
}

const ImageStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
         //console.log(file);
         
         let dir = getDirImage();
         
         mkdirp(dir,(err)=> cb(null,dir));
    },
    filename : (req,file,cb)=>{
         //console.log(file);
         let filePath = getDirImage()+'/'+file.originalname;// masire file 
         if (!fs.existsSync(filePath))// if file is exist
             cb(null , file.originalname);// upload file
         else
             cb(null,Date.now()+'-'+file.originalname);      
             
    }
})

const uploadImage = multer({
    storage : ImageStorage,
    limits : {
        fileSize : 1024*1024*10 
    }
});

module.exports = uploadImage;





















module.exports = uploadImage;
