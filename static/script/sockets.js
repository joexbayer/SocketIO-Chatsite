var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.emit('get_public_key');


socket.on('send_public_key', function(key) {
    //store public key
    publicKey = forge.pki.publicKeyFromPem(key);
    publicKey_text = key;
});

window.onbeforeunload = function(){
    //disconnect user
   socket.emit('disconnect_user', {"roomname": encryptMainPublic(room_key)});
}

socket.on('user_left', function(user) {
    //remove user from list
    console.log(decryptRoom(user));
    document.getElementById(decryptRoom(user)).remove();
    users.splice(users.indexOf(decryptRoom(user)), 1);
});

socket.on('new_user', function(user) {
        //add new user to list
        var ul = document.getElementById("users-list_id");
        var li = document.createElement('li');
        li.id = decryptRoom(user);
        users.push(decryptRoom(user));
        li.appendChild(document.createTextNode(decryptRoom(user)));
        ul.appendChild(li);
});

//on connect
socket.on('connected', function(msg) {
    //store username, add old messages
    for (var i = msg.users.length - 1; i >= 0; i--) {
        var ul = document.getElementById("users-list_id");
        var li = document.createElement('li');
        users.push(decryptRoom(msg.users[i]));
        li.id = decryptRoom(msg.users[i]);
        li.appendChild(document.createTextNode(decryptRoom(msg.users[i])));
        ul.appendChild(li);
    }
    //add all users
    for (var i = msg.log.length - 1; i >= 0; i--) {
        updateMessageBoard("["+decryptRoom(msg.log[i][2])+" - "+decryptRoom(msg.log[i][0])+"]: ", decryptRoom(msg.log[i][1]));
    }
    //update html text and divs
    document.getElementById("room-info").innerHTML = "Room: "+room_id+" | Username: "+username;
    document.getElementById("login_form").style.display = "none";
    document.getElementById("main-chat-container-id").style.display = "block";
});

socket.on('get_message', function(msg) {
    //update new message
    var div = document.getElementById("encrypted-list");
    var marquee = document.createElement ("marquee");
    encryptedlog.push(marquee);
    if(encryptedlog.length > 12){
        encryptedlog[0].parentNode.removeChild(encryptedlog[0]);
        encryptedlog.shift();
    }
    marquee.direction = marquee.direction == "right" ? "left" : "right";
    marquee.appendChild(document.createTextNode(msg.message));
    div.appendChild(marquee);
    div.flexDirection= "column-reverse";
    div.scrollTop = div.scrollHeight;
    updateMessageBoard("["+decryptRoom(msg.time)+" - "+decryptRoom(msg.user_id)+"]: ", decryptRoom(msg.message));
});
