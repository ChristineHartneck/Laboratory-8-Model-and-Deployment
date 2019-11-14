let mongoose = require("mongoose");

var schema = new mongoose.Schema({ 
    title: 'string', 
    content: 'string',
    author: 'string',
    publishDate: Date
});
module.exports = mongoose.model('Blogpost', schema);