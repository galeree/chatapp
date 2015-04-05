(function() {
  var socket = io();
  $(document).ready(function() {
        $('#send').click(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
        });
  });
})();