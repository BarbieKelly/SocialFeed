var api_url = 'http://localhost:3000/';

var email_input = document.getElementById("email_input");
var password_input = document.getElementById("password_input");
var loginButton = document.getElementById("loginButton");

loginButton.onclick = function (){
  
  let email = email_input.value;
  let password = password_input.value;
  let loginData = {
      email: email,
      password: password
  }
  console.log(email);
  axios.get(api_url + `api/users/email/'${email}'`)
    .then(function(result) {
      let currentUser = result.data[0];
      if(password == currentUser.password) {
        console.log("yay");
        window.localStorage.setItem("user_id", currentUser.user_id);
        window.localStorage.setItem("name", currentUser.name);
        //Changes the html page
        window.location = 'index.html';

      }
      else {
        res.status(434).send('Email/Password combination did not match')
      }
  })
    .catch(function(error) {
      res.status(434).send('Email does not exist in the database');
      console.log(error)
      //Code for handling errors
  });
}

// axios.get(api_url + `api/users/email/'barbie@gmail.com'`)