const mongoose = require('mongoose');

//schema setup
const campgroundSchema = new mongoose.Schema({
    name:  String,
    image: String,
    price: String,
    description:  String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        }
    ]
})

module.exports= mongoose.model("CampSites", campgroundSchema);