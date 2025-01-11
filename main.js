require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const user_routes = require('./routes/user_routes');
const admin_routes = require('./routes/admin_routes');
const nocache= require("nocache")
const app = express();
const session = require("express-session")
const User = require('./models/user_model');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache()) 

app.use(express.static('public'));
app.use('/admin',express.static('public'));


app.use(session({

    secret: 'my-secret-key',  
    resave: false,              
    saveUninitialized: true,    
    cookie: { secure: false }

}));
// View Engine 
app.set('view engine', 'ejs');
// Routes
app.use('/', user_routes); 

app.use('/admin', admin_routes); 

app.get('*',(req,res)=>{
    res.redirect('/')
})

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT , '0.0.0.0' , () => console.log(`Server running on port ${PORT}`));
