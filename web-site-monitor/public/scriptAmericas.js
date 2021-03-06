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
 	var database = firebase.database();
 	var ledStatus;

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

 	$("#logout").click(function(){
 		firebase.auth().signOut().then(function() {
  			// Sign-out successful.
		}).catch(function(error) {
  			// An error happened.
  			var errorCode = error.code;
  			var errorMessage = error.message;
  			
  			window.alert("Error : " + errorMessage);
		});
 	});

 	database.ref().on("value", function(snap){
 		ledStatus = snap.val().ledStatus;
 		humidityAlert = snap.val().humidityAlert;

 		$("#temp").text(snap.val().Temperature + " C");
 		$("#humidity").text(snap.val().Humidity + " %");
 		if (ledStatus){
 			$("#lightStatus").text("The light is on");
 		}
 		else{
 			$("#lightStatus").text("The light is off");
 		}

 		if (humidityAlert){
 			$("#alert").text("Alert!");
 		}
 		else{
 			$("#alert").text("Fine");
 		}
 	});
 	$("#lightButton").click(function(){
 		var firebaseRef = firebase.database().ref().child("ledStatus");
 		if (ledStatus){
 			firebaseRef.set(0);
 			ledStatus = 0;
 		}
 		else{
 			firebaseRef.set(1);
 			ledStatus = 1;
 		}
 	});
});