//all the middlewares goes here
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');


let middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(!err){
                 //is the user own the campground?
                 //need to use queals() caz foundCampground.author.id is a mongoose object and req.user._id is a string
                 if(foundCampground.author.id.equals(req.user._id)){
                    //moves on to the next step
                    next();
                 }else{
                    req.flash('error', 'Campground not found');
                    res.redirect('back');
                 }    
            }
            else{
                req.flash('error', 'You dont have permission to do that');
                res.redirect('back');
            }
        });
    }else{
        req.flash('error', 'You need to be logged in');
        //brings the user back where it cames from
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(!err){
                 //is the user own the comment?
                 //need to use queals() caz foundComment.author.id is a mongoose object and req.user._id is a string
                 if(foundComment.author.id.equals(req.user._id)){
                    //moves on to the next step
                    next();
                 }else{
                    req.flash('error', 'Comment not found');
                    res.redirect('back');
                 }    
            }
            else{
                req.flash('error', "You can't do that");
                res.redirect('back');
            }
        });
    }else{
        req.flash('error', 'You need to be logged in');
        //brings the user back where it cames from
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in');
    res.redirect('/login');
}


module.exports = middlewareObj