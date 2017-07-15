function login(){
   var username = document.getElementById("loginusername");
var password = document.getElementById("loginpassword");
    username = username.value;
    password = password.value;
                var ref = new Firebase("https://sweltering-inferno-3150.firebaseio.com");
                ref.authWithPassword({
                                     email    : username,
                                     password : password
                                     }, function(error, authData) {
                                     if (error) {
                                     console.log("Login Failed!", error);
                                     } else {
                                     console.log("Authenticated successfully with payload:", authData);
                                         window.alert("Login!!!");
                                     }
                                     });
    
}