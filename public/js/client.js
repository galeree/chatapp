(function() {
  var socket = io();
  $(document).ready(function() {
      var id = $('body').data("id");
      var user = $('body').data("username");
        $('#send').click(function(){
          socket.emit('chat message', { 
            message: $('#m').val(), 
            username: user}); //send notify msg sent to app.js

          $('#m').val(''); // Clear input box
          return false;
        });

        /* When detect chat message event */
        socket.on('chat message', function(msg){
          var time = new Date(msg.time);
          $('#messages').append($('<li>').text(msg.message))
          .append($('<a>').text(time.toLocaleTimeString()))
          .append($('<a>').text(msg.username));
        });
  });
})();