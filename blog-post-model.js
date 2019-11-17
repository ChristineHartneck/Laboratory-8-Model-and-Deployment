let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let blogPostschema = new mongoose.Schema({ 
    id : {type: String},
    title: {type: String}, 
    content: {type: String},
    author: {type: String},
    publishDate: {type: Date}
});

let Blogpost = mongoose.model('Blogpost', blogPostschema);

let BlogPostList = {
	getAll: function(){
		return Blogpost.find()
			.then(blogPosts => {
				return blog_post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	getById : function(pId) {
		return BlogPost.findOne({id : pId})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	post: function(newPost){
		return BlogPost.create(newPost)
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	deleteById: function(pId) {
		return BlogPost.findOneAndRemove({id:pId})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	updatePost: function(newPost) {
		return BlogPost.findOneAndReplace({id:newPost.id}, newPost, {returnNewDocument:true})
			.then(post => {
				return post;
			})
			.catch(error => {
				throw Error(error);
			})
	}

}

module.exports = {BlogPostList};