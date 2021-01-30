const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    //the id of the author and the username of the author
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        },
        username: String,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
