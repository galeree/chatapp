(function() {
  var socket = io();
  $(document).ready(function() {
        $('#send').click(function(){
          socket.emit('chat message', $('#m').val()); //send notify msg sent to app.js
          $('#m').val(''); //clear input box
          return false;
        });
        socket.on('chat message', function(msg){
          console.log(msg);
          var d = new Date(msg.time);
          $('#messages').append($('<li>').text(msg.message)).append($('<a>').text(d.toLocaleTimeString()));
        });
  });
})();