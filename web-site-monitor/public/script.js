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

 	database.ref().on("value", function(snap){
 		ledStatus = snap.val().ledStatus;
 		if (ledStatus){
 			$(".lightStatus").text("The light is on");
 		}
 		else{
 			$(".lightStatus").text("The light is off");
 		}
 	});
 	$(".lightButton").click(function(){
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