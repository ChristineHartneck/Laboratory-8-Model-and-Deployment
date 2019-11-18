//let url = "http://localhost:8080/api/blog-posts";
//let blogPosts = [];

// Loading the existing posts
function Posts() {
    $("#blogPosts > li").remove();
    $("#errorMessages").text("");
    $.ajax({
        url: "/blog-posts",
        method: "GET",
        dataType: "json",
        success: function(response) {
            blogPosts = [];
            response.map(post => blogPosts.push(post));
        },
        error: function(error) {
            console.log(error);
        }
    }).done(function() {
        blogPosts.forEach(post => {
            let author = $(`<h3> ${post.author} </h3>`);
            let title = $(`<h2> ${post.title} </h2>`);
            let publishDate = $(`<h5> ${post.publishDate} </h5>`);
            let id = $(`<h5> ID: ${post.id} </h5>`);
            let content = $(`<p> ${post.content} </p>`);
            let p = $("<li>").append(id, publishDate,  author, title, content);
            $("#blogPosts").append(p);
        })
    });
}

$("#save").on("click", (event) => {
    event.preventDefault();

    let title = $("#title").val();
    let content = $("#content").val();
    let author = $("#author").val();
    let publishDate = new Date($("#publishDate").val());
    let obj = {
        title: title,
        content: content,
        author: author,
        publishDate: publishDate
    };

    $.ajax({
        url: "/blog-posts",
        data: JSON.stringify(obj),
        method: "POST",
        contentType: "application/json",
        success: function() {
            Posts();
            emptyInput();
        },
        error: function(err) {
            console.log(err);
            $("#errorMessages").text(err.statusText);
        }
    });
});

$("#delete").on("click", (event) => {
    event.preventDefault();


    let id = $("#deleteID").val().trim();
    if(!id) {
        $("#errorMessages").text("No ID was found");
        return;
    }

    let body = {
        id: id
    };

    $.ajax({
        url: "/blog-posts/:id" + '/' + id,
        method: "DELETE",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function() {
            Posts();
            console.log("Blog-Post successful deleted");
            emptyInput();
        },
        error: function(err) {
            console.log(err);
            $("#errorMessages").text(err.statusText);
        }
    });
});

$("#update").on("click", (event) => {
    event.preventDefault();

    let id = $("#updateID").val().trim();
    if(!id) {
        $("#errorMessages").text("No ID was found");
        return;
    }

    let title = $("#updateTitle").val();
    let content = $("#updateContent").val();
    let author = $("#updateAuthor").val();
    let publishDate = new Date();
    let body = $.extend({}, {
        id: id,
        title: title != "" ? title : undefined,
        content: content != "" ? content : undefined,
        author: author != "" ? author : undefined,
        publishDate: publishDate != "" ? publishDate : undefined,
    });

    $.ajax({
        url: "/blog-posts/:id" + '/' + id,
        method: "PUT",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function() {
            Posts();
            console.log("Blog-Post successful updated");
            emptyInput();
        },
        error: function(err) {
            console.log(err);
            $("#errorMessages").text(err.statusText);
        }
    });
});

function emptyInput() {
    $("input[type=text], textarea").val("");
}

Posts();
