const express = require('express');
const router = express.Router();
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
//we dont have to use /index.js bcz it will automaticali require the file that is named index
const middleware = require('../middleware');

//show information
router.get("/", (req,res)=>{
    console.log(req.user);
    Campground.find({})
        .then((allcampGrounds)=>res.render("camp_grounds/index", {campGrounds: allcampGrounds}))
        .catch((err)=> console.log(err));
});

//adding the new info to the DB
router.post("/", middleware.isLoggedIn,(req,res)=>{
    //get the data
    //eevry data about the created campground
    let author = {
        id: req.user._id,
        username: req.user.username,
    }

    let newCampground={name: req.body.campName, image: req.body.imgUrl, price:req.body.campPrice ,description:req.body.description, author: author};
    Campground.create(newCampground)
        .then((newlyCreated)=>{
            console.log(newlyCreated)
            res.redirect('/campgrounds')
        })
        .catch((err)=> console.log(err));
});

//form to create new info
router.get('/new', middleware.isLoggedIn ,(req,res)=>{
    res.render("camp_grounds/new.ejs");
});


router.get('/:id', (req, res)=>{
    //find the campground with the given id
    Campground.findById(req.params.id).populate("comments").exec()
        .then((foundCampground)=>{
            console.log(foundCampground)
            res.render("camp_grounds/show", {campground:foundCampground})
        })
        .catch((err)=> console.log(err))
});

//edit route
router.get('/:id/edit', middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(!err){   
            res.render('camp_grounds/edit',{campground: foundCampground})
        }
        else{
            req.flash('error', 'Campground not found :(');
            res.redirect('/campgrounds')
        }
    });
})

//update rout
router.put('/:id', middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
        if(!err){
            res.redirect(`/campgrounds/${req.params.id}`)
        }
        else{
            console.log(err);
            res.redirect('/campgrounds')
        }
    })
})

//destroy route
router.delete('/:id', middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(!err){
            //delete the comments from that campground
            foundCampground.comments.forEach(comment=>{
                Comment.findByIdAndRemove(comment, (err)=>{
                    if(err){
                        console.log(err)
                    }
                })
                
            })
        }
        else{
            console.log(err);
        }
    })

    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(!err){
            res.redirect('/campgrounds')
        }
        else{
            console.log(err)
        }    

    })

})


module.exports = router;