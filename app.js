const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
const shopRoute = require('./routes/shop.route');
const adminRoute = require('./routes/admin.route');
// const mongoConnect = require('./util/database').mongoConnect;
const errorController = require('./controllers/error.controller');

const User = require('./models/user.model');

//-------Middlewares

//setting up view engine (when we are not using REACT as our view)
app.set('view engine', 'ejs');
//specify views folders name
app.set('views', 'views');

//parse the request body into readable data
app.use(bodyParser.urlencoded({extended:false}));
//specify the public folder to be of static access
// app.use(express.static(path.join(__dirname,'public')));
app.use('/public', express.static('public'));

//dummy auth flow ----storing a reference of a user
app.use((req,res,next) => {
    // const user = new User('admin', 'admin@mail.com');
    // user.save()
    //     .then((result) => {
    //         console.log(result)
    //         next();
    //     })
    //     .catch(err => console.log(err));
    User.findById('5f6106ff2308822e64b00303')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

//set the routes for admin
app.use('/admin', adminRoute);
//set the routes for shop
app.use(shopRoute);

//error 404 checking middleware
app.use(errorController.get404);

//-------end of Middlewares

//set up the port 
const PORT = process.env.PORT || 8000;

    mongoose
        .connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(()=>{
            console.log('Connected to Database!');
            app.listen(PORT, ()=> console.log(`Server started at port ${PORT},`))

            User.findOne().then((user)=>{
                if(!user){
                    const user = new User({
                        name: 'Zack',
                        email: 'zack@minipixel.ca',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });            
        })
        .catch(err=> console.log(err))


// mongoConnect(() =>  {
//     app.listen(PORT, ()=> console.log(`Server started at port ${PORT}.`))
// })