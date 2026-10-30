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
  var ref = firebase.database().ref();
  var listener = null;
  var ledStatus = null;
  var pending = false;
  var generation = 0;
  var button = document.getElementById('lightButton');
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', 'Cambiar estado de la luz');
  function enabled() {
    var ready = ledStatus !== null && !pending && !!firebase.auth().currentUser;
    button.setAttribute('aria-disabled', String(!ready));
    return ready;
  }
  function reset(message) {
    ledStatus = null;
    $('#temp, #humidity').text('—');
    $('#lightStatus').text('Sin datos');
    $('#alert').text(message);
    enabled();
  }
  function detach() {
    if (listener) ref.off('value', listener);
    listener = null;
    generation++;
  }
  reset('Cargando…');
  firebase.auth().onAuthStateChanged(function (user) {
    detach();
    reset('Cargando…');
    if (!user) { window.location.replace('/'); return; }
    $('#userEmail').text(user.email || '');
    var current = generation;
    listener = function (snap) {
      if (current !== generation) return;
      var data = snap.val();
      if (!data) { reset('Sin mediciones'); return; }
      $('#temp').text(typeof data.Temperature === 'number' ? data.Temperature + ' °C' : '—');
      $('#humidity').text(typeof data.Humidity === 'number' ? data.Humidity + ' %' : '—');
      ledStatus = data.ledStatus === 0 || data.ledStatus === 1 ? data.ledStatus : null;
      $('#lightStatus').text(ledStatus === null ? 'Sin datos' : ledStatus ? 'Luz encendida' : 'Luz apagada');
      $('#alert').text(data.humidityAlert === 1 ? '¡Alerta de humedad!' : data.humidityAlert === 0 ? 'Normal' : 'Sin datos de alerta');
      enabled();
    };
    ref.on('value', listener, function () {
      if (current === generation) reset('No se pudieron leer los datos. Revisa permisos y conexión.');
    });
  });
  $('#logout').click(function () {
    firebase.auth().signOut().catch(function () { window.alert('No se pudo cerrar sesión. Inténtalo de nuevo.'); });
  });
  function toggle() {
    if (!enabled()) return;
    pending = true;
    enabled();
    // Transactions retry with the latest server value when another client writes.
    ref.child('ledStatus').transaction(function (value) {
      if (value === null) return 1;
      if (value !== 0 && value !== 1) return;
      return value === 1 ? 0 : 1;
    }, function (error, committed) {
      pending = false;
      enabled();
      if (error || !committed) window.alert('No se pudo cambiar la luz. Revisa permisos y conexión.');
    }, false);
  }
  $('#lightButton').click(toggle);
  $('#lightButton').keyup(function (event) { if (event.keyCode === 13 || event.keyCode === 32) toggle(); });
});
