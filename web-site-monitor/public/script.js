// Initialize Firebase
 var config = {
	apiKey: "AIzaSyBjTGkYBr8DlxZLATlkEsi9geEMK_DldZY",
    authDomain: "site-monitor-01.firebaseapp.com",
    databaseURL: "https://site-monitor-01.firebaseio.com",
    projectId: "site-monitor-01",
    storageBucket: "site-monitor-01.appspot.com",
    messagingSenderId: "612482407497"
 };
 firebase.initializeApp(config);

 $(document).ready(function(){

 	$("#login").click(function(){
 		var userEmail = document.getElementById("form2").value;
 		var userPassword = document.getElementById("form4").value;

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function() {
      return firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error : " + errorMessage);
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
      var pathname = window.location.pathname;
        if (user) {
          // User is signed in.
          if (pathname == "/") {
            //window.location.replace("https://site-monitor-01.firebaseapp.com/americas.html");
            window.location.replace("americas")
          }
          var user = firebase.auth().currentUser;
          if (user != null) {
            var email_id = user.email;

            $("#userEmail").text(email_id);
          }
        } else {
          // No user is signed in.
          if (pathname == "/americas") {
            //window.location.replace("https://site-monitor-01.firebaseapp.com/");
            window.location.replace("/")
          }
        }
    });
		
 	});
 	$("#form4").keyup(function(event) {
    	if (event.keyCode === 13) {
        	$("#login").click();
    	}
	});
  $("#form2").keyup(function(event) {
      if (event.keyCode === 13) {
          $("#login").click();
      }
  });
 });