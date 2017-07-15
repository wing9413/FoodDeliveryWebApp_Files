function signup(){
   var username = document.getElementById("email");
var password = document.getElementById("passwd");
        username = username.value;
    password = password.value;
    var ref = new Firebase("https://sweltering-inferno-3150.firebaseio.com");
    ref.createUser({
        email: username,
        password: password
    }, function(error, userData) {
    if (error) {
    switch (error.code) {
      case "EMAIL_TAKEN":
        console.log("The new user account cannot be created because the email is already in use.");
        break;
      case "INVALID_EMAIL":
        console.log("The specified email is not a valid email.");
        break;
      default:
        console.log("Error creating user:", error);
    }
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
      window.alert("User Created");
      var authData = ref.getAuth();
      var userRef = ref.child(ref.uid());
      userRef.set({'address' : 'address'});
      
  }
});
    
    
    
    
}