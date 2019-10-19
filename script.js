//The user should have the ability to delete a post
//BONUS: Give the ability for the user to update the post in the feed.


var container = document.getElementById("container");
var imageAreaElement = document.getElementById("image");
var textAreaElement = document.getElementById("text");
var colorAreaElement = document.getElementById("color");
var button = document.getElementById("submitButton");
var data = [];

var myFunction = function () {
        
    button.onclick = function(){
        var temp = Date();
        var currentdate = temp.slice(0, temp.length -33);
        var currentColor = colorAreaElement.value;

        if(textAreaElement.value && textAreaElement.value !== "paste text here" && textAreaElement.value !== ""){
            var currentText = textAreaElement.value;
        }

        if(imageAreaElement.value && imageAreaElement.value !== "paste url for image here" && imageAreaElement.value !== ""){
            var currentImage = imageAreaElement.value;
        }
        
        if (currentText || currentImage) {
            data.push({Date: currentdate, Text: currentText, Image: currentImage, Color: currentColor});
            var numPosts = data.length-1;
            var post = document.createElement("div");
            post.className = "post " + numPosts;
            var row1 = document.createElement("div");
            row1.className = "row inputRow";
            var row2 = document.createElement("div");
            row2.className = "row metaRow";
            var column1 = document.createElement("div");
            column1.className = "col-4 imgColumn";
            var column2 = document.createElement("div");
            column2.className = "col textColumn";
            var column3 = document.createElement("div");
            column3.className = "col dateColumn";
            var postImage = document.createElement("img");
            var postText = document.createElement("p");
            var postMeta = document.createElement("p");

            if(data[numPosts].Text){
                postText.innerHTML = data[numPosts].Text;
                postText.style = "color: " + currentColor;
            }

            if (data[numPosts].Image){
                postImage.src = data[numPosts].Image;
                postImage.width = "200";
            }
            
            postMeta.innerHTML = data[numPosts].Date;
            postMeta.className = "text-center";
            column1.appendChild(postImage);
            column2.appendChild(postText);
            row1.appendChild(column1);
            row1.appendChild(column2);
            column3.appendChild(postMeta);
            row2.appendChild(column3);
            post.appendChild(row1);
            post.appendChild(row2);
            container.appendChild(post);
        }
        
        document.getElementById("image").value = "paste url for image here";
        document.getElementById("text").value = "paste text here";
        document.getElementById("color").value = "#000000";
        console.log(data[numPosts]);
    }
}

myFunction();