var config = {
  apiKey: "AIzaSyBjTGkYBr8DlxZLATlkEsi9geEMK_DldZY",
  authDomain: "site-monitor-01.firebaseapp.com",
  databaseURL: "https://site-monitor-01.firebaseio.com",
  projectId: "site-monitor-01",
  storageBucket: "site-monitor-01.appspot.com",
  messagingSenderId: "612482407497"
};
firebase.initializeApp(config);

$(document).ready(function () {
  var busy = false;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) window.location.replace('/americas');
  });
  function signIn() {
    if (busy) return;
    busy = true;
    $('#login').prop('disabled', true);
    var persistence = document.getElementById('checkbox1').checked
      ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    firebase.auth().setPersistence(persistence).then(function () {
      return firebase.auth().signInWithEmailAndPassword(
        document.getElementById('form2').value.trim(), document.getElementById('form4').value);
    }).catch(function () {
      window.alert('No se pudo iniciar sesión. Revisa tus credenciales y conexión.');
    }).then(function () {
      busy = false;
      $('#login').prop('disabled', false);
    });
  }
  $('#login').click(signIn);
  $('#form2, #form4').keyup(function (event) { if (event.keyCode === 13) signIn(); });
});
