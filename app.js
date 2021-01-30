const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      Campground = require('./models/campgrounds'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      seedDB    = require('./seeds');



//authorization:
    //figuring what can a preson do (ex: he can delete or edit only his own campgrounds)
    
//authentification
    //figuring out if someone is the person that he claims to be
    
//requiring routes 
const campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes = require('./routes/comments'),
      indexRoutes = require('./routes/index');

mongoose.connect('mongodb+srv://Norbert:1Kitoltamveled@cluster0.f9spe.azure.mongodb.net/YelpCamp', {useNewUrlParser: true,  useUnifiedTopology: true});

const app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
//we only use flash and no other configs caz we are already using express session etc
app.use(flash());
//seedDB();/seed the database

//passport config
app.use(require('express-session')({
    secret:'the best campgrounds',
    resave:false,
    saveUninitialized:false,
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this will be a middleware that will run on every single code so every page knows about the user and about the flash
app.use((req,res, next)=>{
    res.locals.currentUser=req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
//appends /campgrounds to each url so ex: '/campgrounds/:id'-> can be replaced with /:id in campgrounds.js
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function() {
    console.log("YelpCamp Server is Running");
})

