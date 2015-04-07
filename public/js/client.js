(function() {
  var socket = io();
  $(document).ready(function() {
      var id = $('body').data("id");
      var user = $('body').data("username");
      var roomid = getQueryStrings["roomid"];
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

        /* When user connect */
        socket.on('connect', function() {
          var roomid = getQueryStrings()["roomid"];
          console.log(roomid);
          socket.emit('adduser', roomid);
        });
  });

  function getQueryStrings() { 
    var assoc  = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1); 
    var keyValues = queryString.split('&'); 

    for(var i in keyValues) { 
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    } 

    return assoc; 
  } 
})();