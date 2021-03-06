const restify = require ('restify'); // Requesting the use of package restify
const sequelize = require('./db/config');
const Sequelize = require('sequelize');
const corsMiddleware = require("restify-cors-middleware");
const port = 3002; // Port on which our server will run
const server = restify.createServer (); // Create our server interface 

 
/* We've
added the bodyparser plugin, to work with json automatically
on input and output and also to have restify already map input parameters
*/

const cors = corsMiddleware({  
    origins: ["*"],
    allowHeaders: ["Authorization"],
    exposeHeaders: ["Authorization"]
});


server.pre(cors.preflight);  
server.use(cors.actual);  
server.use (restify.plugins.bodyParser ({
mapParams: true,
mapFiles: false,
overrideParams: false
}));
sequelize.authenticate().then(() => {
    console.log("Success!");
    var Posts = sequelize.define('posts', {
      title: {
        type: Sequelize.STRING(500)
      },
      content: {
        type: Sequelize.STRING(15500)
      },
      glimpse:{
        type: Sequelize.STRING(15500)
      },
      image:{
        type: Sequelize.STRING(1500)
      }
    }, {
      freezeTableName: true
    });
  
    Posts.sync({force: true}).then(function () {
      // return Posts.create({
      //   title: 'Getting Started with PostgreSQL and Sequelize',
      //   content: 'Hello there'
      // });
    });
  }).catch((err) => {
    console.log(err);
  });
/*
Creating an input route for our API,
here could be a post (insert), put (update), del (delete),
as we will only return one object, we will use get (search / return).
- Request, serves to get some parameter or header of the request;
- Response, returns a response / status from our api;
- next, this method is for stopping code execution at a given time and jumping
to the next method / function, if any.
*/
server.get ('/', (request, response, next) => {
// we will be returning to test status 200 (Browser interprets the request returned successfully), saying the response is ok and an object json with a message
const greturn = {return: 'restify ok'};
response.send (200, greturn);
next ();
});


server.post('/insert',(req,res,next)=>{
    sequelize.authenticate().then(() => {
        
       
        if (req.body.title && req.body.content)
        {
            var Posts = sequelize.define('posts', {
              title: {
                type: Sequelize.STRING(500)
              },
              content: {
                type: Sequelize.STRING(55500)
              },
              glimpse:{
                type: Sequelize.STRING(1500)
              },
              image:{
                type: Sequelize.STRING(1500)
              }
              }, {
                freezeTableName: true
              });
                var item =  Posts.build({
                  title: req.body.title,
                  content: req.body.content,
                  glimpse:req.body.glimpse,
                  image:req.body.image,

                });
                res.send (200, req.body.title);
                item.save().complete(function (err) {
                    if (err) {

                       console.log('Error in Inserting Record');
                    } else {
                       console.log('Data successfully inserted');
                    }
                });
               
        }
        else{
            res.send (200, {error:"please Check the field"});
        }
       
    })

})

server.get('/getPost',(req,res,next)=>{
    
            var Posts = sequelize.define('posts', {
                title: {
                  type: Sequelize.STRING
                },
                content: {
                  type: Sequelize.STRING
                },glimpse:{
                  type: Sequelize.STRING
                },
                image:{
                  type: Sequelize.STRING
                }
              }, {
                freezeTableName: true
              });
                var item =  Posts.findAll().then(re=>{
                    res.send (200, re);
                });
              
               
        
})
// We will run our server with the settings and routes previously added
server.listen (port, () => {
console.log (`restify running on port: $ {port}`);
});
// We export our server variable so that it becomes "public" and is executed by index.js
module.exports = server;