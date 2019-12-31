var api_url = 'http://localhost:3000/';
var allPosts = [];
var currentUser = 1;

var container = document.getElementById("container");
var imageAreaElement = document.getElementById("image");
var textAreaElement = document.getElementById("text");
var colorAreaElement = document.getElementById("color");
var submitButton = document.getElementById("submitButton");
var clearButton = document.getElementById("clearButton");
var currentColor = colorAreaElement.value;

imageAreaElement.onclick = function (){
    imageAreaElement.value = "";
}

textAreaElement.onclick = function (){
    textAreaElement.value = "";
}

clearButton.onclick = function () {
    imageAreaElement.value = "paste url for image here";
    textAreaElement.value = "paste text here";
    colorAreaElement.value = "#000000";
}

function createPostItem(data) {
    var post = document.createElement("div");
    postId = data.id;
    postColor = data.color;
    postDate = data.date;

    post.className= "post " + postId;
    post.style = "border-color: " + postColor;
    var row1 = document.createElement("div");
    row1.className = "row inputRow";
    var row2 = document.createElement("div");
    row2.className = "row metaRow align-items-center";
    var column3 = document.createElement("div");
    column3.className = "col dateColumn";
    var column4 = document.createElement("div");
    column4.className = "col-2 deleteButtonColumn";
    var column5 = document.createElement("div");
    column5.className = "col-2 editButtonColumn";
    var deleteButton = document.createElement("button");
    deleteButton.id = "deleteButton " + postId;
    deleteButton.className = "btn btn-outline-danger btn-sm deleteButton";
    deleteButton.innerHTML = "Delete";
    var editButton = document.createElement("button");
    editButton.id = "editButton " + postId;
    editButton.className = "btn btn-outline-secondary btn-sm editButton";
    editButton.innerHTML = "Edit";
    var postMeta = document.createElement("p");
    postMeta.innerHTML = postDate;
    postMeta.className = "text-center italicDate";

    // Only creates the div for an image if the post contains an image. Creates a col-3.
    if (data.imageurl !== "" & data.imageurl !== null){
        var column1 = document.createElement("div");
        column1.className = "col-3 imgColumn";
        var postImage = document.createElement("img");
        postImage.src = data.imageurl;
        postImage.className = "img-fluid img-thumbnail";
        postImage.SameSite = "None";
        column1.appendChild(postImage);
        row1.appendChild(column1);
    }
        
    // Only creates the div for text if the post contains text. Creates a col of undefined width
    // So that if a post does not have an image, The text will take up the entire post
    if(data.body !== "" & data.body !== null){
        var column2 = document.createElement("div");
        column2.className = "col textColumn";
        var postText = document.createElement("p");
        postText.innerHTML = data.body;
        postText.style = "color: " + postColor;
        column2.appendChild(postText);
        row1.appendChild(column2);
    }

    deleteButton.onclick = function(){
        // The ID of each delete button is "deleteButton 0", "deleteButton 1" etc where the integers refer to the post's id
        // this.id.slice returns "0", "1", etc. 
        // parseInt transfomrs "0" to 0 (String to integer)
        //var postPosition = parseInt(this.id.slice(13,14), 10);
    };

    editButton.onclick = function(){
        //var postPosition = parseInt(this.id.slice(11,12), 10);
    };

    column5.appendChild(editButton);
    column4.appendChild(deleteButton);
    column3.appendChild(postMeta);
    row2.appendChild(column3);
    row2.appendChild(column5);
    row2.appendChild(column4);
    post.appendChild(row1);
    post.appendChild(row2);
    container.appendChild(post);
}        


var getAllPosts = function () {
    axios.get(api_url + `api/posts`)
    .then(function(data) {
        allPosts = data.data;
        createFeed();
        })
        .catch(function(error) {
            console.log(error)
            //Code for handling errors
        });
}

var createFeed = function () {
    container.innerHTML = '';
    for (i=0; i < allPosts.length; i++){
        createPostItem(allPosts[i]);
    }
}

getAllPosts();

var sendPostRequest = function(requestBody) {
    axios.post(api_url + `api/posts`, requestBody)
    .then(function(result) {
        getAllPosts();
        console.log(result)
    })
        
    .catch(function(error) {
        console.log(error)
        //Code for handling errors
     });
}
// pushes the information from the input area to the data array. 
submitButton.onclick = function(){
        // slice method removes part of a string. currentdate uses the Date() method but does not return the time zone.        
        var currentdate = Date().slice(0, Date().length -33);
        var currentText = "";
        var currentImage = "";
        currentColor = colorAreaElement.value;
        // tests if there is any information in the text box that is not the default text or blank
        if(textAreaElement.value && textAreaElement.value !== "paste text here" && textAreaElement.value !== ""){
            currentText = textAreaElement.value;
        }
        // tests if there is any information in the image box that is not the default text or blank
        if(imageAreaElement.value && imageAreaElement.value !== "paste url for image here" && imageAreaElement.value !== ""){
            currentImage = imageAreaElement.value;
        }  
        // tests if there is any information in either the text or image box. So that there are no blank posts
        if(imageAreaElement.value || imageAreaElement.value) {
            var currentPost = {Date: currentdate, body: currentText, imageurl: currentImage, color: currentColor, user_id: 1};
            console.log(currentPost);
            sendPostRequest(currentPost);
        }
        
        // resets the default values for the input boxes
        document.getElementById("image").value = "paste url for image here";
        document.getElementById("text").value = "paste text here";
        document.getElementById("color").value = "#000000";

        // creates the Feed
        
}