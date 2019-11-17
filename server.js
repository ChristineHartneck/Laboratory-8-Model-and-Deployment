
let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require('mongoose');
let config = require("./config");
let {BlogPostList} = require("./blog-post-model");
let bodyParser = require( "body-parser" ); //caching the bodyformat to a jsonformat
let uuid = require ( "uuid/v4" );
//mongoose.connect(config.DATABASE_URL, {useNewUrlParser: true});
const {DATABASE_URL, PORT} = require ( './config' );

let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false}));
app.use (jsonParser);


app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

/*const post = {
	id: uuid.v4(),
	title: string,
	content: string,
	author: string,
	publishDate: Date
}*/

let blog_posts = [{
	id : uuid(),
	title : "First-Blog",
	content : "Hello, my name is...",
	author : "Christine",
	publishDate: new Date(2019, 10, 25)
},
{
	id : uuid(),
	title : "Blog",
	content : "Hey, how are you?",
	author : "Brain",
	publishDate: new Date(2019, 10, 26)
},
{
	id : uuid(),
	title : "Blog-3",
	content : "I like..",
	author : "Fabian",
	publishDate: new Date(2019, 10, 27)
}];
app.get("/blog-posts", (req, res, next) =>{
	BlogPostList.getAll()
		.then( blog_posts => {
			return res.status(200).json(blog_posts);
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		})
});


app.get( "/api/blog-post", ( req, res, next ) => {
	let author = req.query.author;
	if (!author){
		return res.status( 406 ).json({
		message : "Missing author on query!",
		status : 406
	});
}
//filtering the blog posts by looking throw each element by matching author
	BlogPostList.find({author:author}, (err, blog_posts) => {
		//if(err) return res.status(400).json({message: err.message})

		if (blog_posts.length == 0){
			return res.status( 404 ).json(
				{message : "Author doesn't exist!",
				status : 404
			});

		}
		return res.status( 200 ).json({blog_posts});
	});
});



app.post( "/api/blog-posts", jsonParser, ( req, res, next ) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

console.log(title);
console.log(content);
console.log(author);
console.log(publishDate);
console.log(req.body)

	if ( ! title || ! content || ! author || !publishDate ){
		res.statusMessage = "Missing all fields in body!";
		return res.status( 406 ).json({
			message : "Missing all fields in body!",
			status : 406
		});
	}

	var newPost = new Blogpost({
		id : uuid.v4(),
		title : title,
		content: content,
		author: author,
		publishDate: new Date(publishDate)
	});
	newPost.save( err =>{
		if(err) return res.status(500).json({
			message : "Something went wrong with the database. Try again later.",
			status : 500
		});
		// saved!
		return res.status( 201 ).json({
			message : "New post is created",
			status : 201,
			posts : newPost
		});
	  });




});

app.delete("/api/blog-posts/:id", (req, res) =>{
	let id = req.params.id;
	BlogPostList.deleteOne({ _id: id }, (err, deleteResult) => {
		//if(err) return res.status(400).json({message: err.message})
		if (deleteResult.deletedCount == 0){
			return res.status(404).json({
				message: "ID of the post doesn't exist!",
				status: 404
			});
		}
		return res.status(200).json({
			message : "Post successful deleted!",
			status : 200
		});
	});

});

app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
	let id = req.body.id;
	let id2 = req.params.id;
	console.log(req.body);
	console.log(req.params);
	//check if the ID's exists
	if(!id || !id2) {
		res.statusMessage = "Missing the ID!";
		return res.status(406).json({
			message: "Missing the ID!",
			status: 406
		});
	}

	// check if the ID's are the same
	if (id != id2){
		res.statusMessage = "The ID's are different!";
		return res.status(409).json({
			message: "The ID's are different!",
			status: 409
		});
	}

	let postInfo = req.body;


	BlogPostList.findByIdAndUpdate(id, postInfo , { new: true },(err, updatedPost) => {
		//if(err) return res.status(400).json({message: err.message})
		if (!updatedPost){
			return res.status(404).json({
				message: "ID of the post doesn't exist!",
				status: 404
			});
		}
		if(postInfo.title)
			newPost.title = postInfo.title

		if(postInfo.content)
			newPost.content = postInfo.content

		if(postInfo.author)
			newPost.author = postInfo.author

		if(postInfo.publishDate)
			newPost.publishDate = postInfo.publishDate

		return res.status(202).json(updatedPost);
	});
});





let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
