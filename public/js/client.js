(function() {
  var socket = io();
  $(document).ready(function() {
      var id = $('body').data("id");
      var user = $('body').data("username");
      var roomid = getQueryStrings["roomid"];

      //send notify msg sent to app.js
      $('#send').click(function(){ 
        var roomid = getQueryStrings()["roomid"];
        socket.emit('chat message', { 
          message: $('#m').val(), 
          username: user,
          user_id: id,
          group_id: roomid
        });

        // Clear input box
        $('#m').val(''); 
        return false;
      });

      $('#m').keypress(function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();

          var roomid = getQueryStrings()["roomid"];
          socket.emit('chat message', { 
            message: $('#m').val(), 
            username: user,
            user_id: id,
            group_id: roomid
          });

          // Clear input box
          $('#m').val(''); 
          return false;
        }
      });

      /* When detect chat message event */
      socket.on('chat message', function(msg){
        var time = new Date(msg.time);
        $('#messages')
          .append($('<div id="chatbox2">')
            .append($('<img class="profile-img" src="/image/accountlogo.png" id="pic">').text(msg.message))
            .append($('<b><span>').text(msg.username))
            .append($('<span>').text(time.toLocaleTimeString()))
            .append($('<li>').text(msg.message))
          );
      });

      /* When user connect */
      socket.on('connect', function() {
        var roomid = getQueryStrings()["roomid"];
        socket.emit('adduser', roomid);
      });
  });

  //  Function to get value from query string
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