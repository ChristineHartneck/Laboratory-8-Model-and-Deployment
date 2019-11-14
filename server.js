
let express = require( "express" );
let morgan = require( "morgan" );
let config = require("./config");
let Blogpost = require("./blog-post-model");
let bodyParser = require( "body-parser" ); //caching the bodyformat to a jsonformat
let uuid = require ( "uuid/v4" );const mongoose = require('mongoose');
mongoose.connect(config.DATABASE_URL, {useNewUrlParser: true});

let app = express();
let jsonParser = bodyParser.json();
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
app.get( "/api/blog-posts", ( req, res, next ) => {
	
	Blogpost.find({}, (err, blogposts) => {
		if(err) return res.status(400).json({error: err})

		return res.status( 200 ).json({blogposts});
	});


});

app.get( "/api/blog-post", ( req, res, next ) => {
	let author = req.query.author;
	if (!author){
		return res.status( 406 ).json(
		{message : "Missing author on query!",
		status : 406
	});
}
//filtering the blog posts by looking throw each element by matching author
	Blogpost.find({author:author}, (err, blogposts) => {
		if(err) return res.status(400).json({message: err.message})

		if (blogposts.length == 0){
			return res.status( 404 ).json(
				{message : "Author doesn't exist!",
				status : 404
			});

		}
		return res.status( 200 ).json({blogposts});
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
		title : title,
		content: content,
		author: author,
		publishDate: new Date(publishDate)
	});
	newPost.save( err=>{
		if(err) return res.status(400).json({message: err.message});
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
	Blogpost.deleteOne({ _id: id }, (err, deleteResult) => {
		if(err) return res.status(400).json({message: err.message})
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


	Blogpost.findByIdAndUpdate(id, postInfo , { new: true },(err, updatedPost) => {
		if(err) return res.status(400).json({message: err.message})
		if (!updatedPost){
			return res.status(404).json({
				message: "ID of the post doesn't exist!",
				status: 404
			});
		}
		
		return res.status(202).json(updatedPost);
	});
});





app.listen( config.PORT, () => {
	console.log( "App is running on port " + config.PORT);
});
