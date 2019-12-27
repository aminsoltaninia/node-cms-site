
let ConnectRoles = require('connect-roles');
const Permission = require('app/models/permission');
 
let gate = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.locals.layout = "errors/master";
    res.status(403);
    if (accept.indexOf('html')) {
      res.render('errors/403', {action});
    } else {
      res.json('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

// gate.use('access course page', function (req) {
//     // if (req.user.role === 'moderator') {
//     //   return true;
//     // }
//     return true;
// });

// gate.use('access edit-course page' , (req)=>{
//    if(req.courseUserId == req.user.id ) return true ;

// });


// gate.use('access approved-comment page',(req)=>{
//     return false;
// });

const permissions = async () =>{
      return await Permission.find({}).populate('roles').exec();
}

permissions()
    .then(permissions => {
        permissions.forEach(permission => {
            let roles = permission.roles.map(item => item._id);
            console.log('roles : ' , roles)
            gate.use(permission.name , (req) => {
                console.log(permission.name)
                return (req.isAuthenticated())
                        ? req.user.hasRole(roles)
                        : false;
            });
        })
    });


module.exports = gate;