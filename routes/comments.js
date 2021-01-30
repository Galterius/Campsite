const express = require('express');
//otherwise we cant find the :id when we want to add a new comment caz we moved the /campgrounds/:id/comments out to the express router
const router = express.Router({mergeParams: true});
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
const middleware = require('../middleware');


// comment routs
//comments new form
router.get('/new', middleware.isLoggedIn, (req,res)=>{
    //find by ID
    Campground.findById(req.params.id, (err, campground)=>{
        if(!err){
            res.render("comments/new", {campground: campground});
        }else{
            console.log(err);
        }
    })
   
})

//defending the post route caz if anyone send a post request ex: with postman he still can post a comment
//create the comment that was made in the form
router.post('/', middleware.isLoggedIn, (req,res)=>{
    //look up the campground by the id
    Campground.findById(req.params.id, (err, campground)=>{
        if(!err){
            //req.body.comment contains a key value pair with author and text
            Comment.create(req.body.comment, (err,comment)=>{
                if(!err){
                    //add username and id to comment
                    //save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //findby returns a campground, so we can push the id an the author into it
                    campground.comments.push(comment);
                    //save it
                    campground.save();
                    //display it
                    req.flash('success', "Comment added");
                    res.redirect(`/campgrounds/${campground._id}`);
                }else{
                    console.log(err);
                    req.flash('error', "Something went wrong");
                }
            })
        }else{
            console.log(err);
            res.redirect('/campgrounds');
        }
    })

    //create a new comment
    //connect new comment to campground
    //redirect to campground showpage
});

//comment edit
router.get('/:comment_id/edit',middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id)
        .then((foundComment)=>{
            res.render('comments/edit', {campground_id: req.params.id, comment:foundComment});
        })
        .catch((err)=>{
            console.log(err)
            res.redirect('back')
        })
    
});

//comment route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
        .then(()=>res.redirect(`/campgrounds/${req.params.id}`))
        .catch((err)=>{
            console.log(err)
            res.redirect('back')
        })
});

//destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id)
        .then(()=>{
                req.flash('success', "Comment deleted");
                res.redirect(`/campgrounds/${req.params.id}`)
            })
        .catch((err)=>res.redirect('back'))
})


module.exports = router;