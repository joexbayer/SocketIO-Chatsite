var chatlog = [];
var encryptedlog = [];
var room_id = "";
var users = [];
var username = "";
var publicKey = "";
var publicKey_text;
var room_key = "";

//update intro text
function updateText(){
    if (document.getElementById("username_id").value != ""){
        document.getElementById('username-text').style.display = 'block';
        document.getElementById("username_id").style.animation = "none";
        document.getElementById("username_id").value = document.getElementById("username_id").value.replace(/\s+/g,"-");
    } else {
        document.getElementById('username-text').style.display = 'none';
        document.getElementById("username_id").style.animation = "blinker 2s linear infinite";
    }
    if (document.getElementById("roomid_id").value != ""){
        document.getElementById('room-text').style.display = 'block';
        document.getElementById("roomid_id").style.animation = "none";
        //replace spave with "-"
        document.getElementById("roomid_id").value = document.getElementById("roomid_id").value.replace(/\s+/g,"-");
    } else {
        document.getElementById('room-text').style.display = 'none';
        document.getElementById("roomid_id").style.animation = "blinker 2s linear infinite";
    }
    if(document.getElementById("username_id").value != "" && document.getElementById("roomid_id").value != ""){
        document.getElementById('join-button').style.display = 'block';
    } else {
        document.getElementById('join-button').style.display = 'none';
    }
    if(document.getElementById("message_text_id").value != ""){
        document.getElementById("message_text_id").style.animation = "none";
    } else {
        document.getElementById("message_text_id").style.animation = "blinker 2s linear infinite";
    }
}

//add "room-" on input
function inputRoomText(){
     document.getElementById("roomid_id").value = "room-";
}


function formSubmitt(){
    if(room_id != ""){
        socket.emit('leave-room', room_key);
    }

    //get input text
    room_id = document.getElementById("roomid_id").value;
    user = document.getElementById("username_id").value;
    username = user;

    var re = /[^A-Za-z0-9]+/g;
    user = user.replace(re, "");

    if(user.length < 3){
        alert("Username must be atleast 3 characters!")
        return;
    }
    if(user.length > 8){
        alert("Username must be less then 9 characters!")
        return;
    }

    //create AES sha256, encryption of room_id
    var md = forge.md.sha256.create();
    md.start();
    md.update(room_id, "utf8");
    room_key = md.digest().toHex();
    //room_key = room_key.substr(0, 32);

    //add socket id to room
    room_id_sub = room_key +" "+socket.id;

    //encrypt data
    room_id_enc = encryptMainPublic(room_id_sub);
    user_enc = encryptRoom(user);

    //send data
    socket.emit('join-room', room_id_enc+":"+user_enc);
}

function updateMessageBoard(title, msg){
    //add message to html
    var ul = document.getElementById("chat-list");
    var checkBox1 = document.getElementById("html-filter");
    var checkBox2 = document.getElementById("char-filter");
    var p = document.createElement('p');
    var chat_cont = document.createElement('div');
    var message_p = document.createElement('p');
    chatlog.push(p);
    if(chatlog.length > 35){
        chatlog[0].parentNode.removeChild(chatlog[0]);
        chatlog.shift();
    }
    //filters
    if (checkBox1.checked == false){
        var re = /https?:\/\/(www.)?/;
        if(msg.match(re)){
            msg = "[Message blocked because of a filter!]";
        }
    }
    if (checkBox2.checked == false){
        var re = /[^A-Za-z0-9:[\].,!?-\w ]+/g;
        if(msg.match(re)){
            msg = msg.replace(re, "") + " [FILTERED!]";
        }
    }
    p.appendChild(document.createTextNode(title));
    p.style.color = "#48f542";
    message_p.appendChild(document.createTextNode(msg));
    message_p.style.marginLeft = "1%";
    chat_cont.appendChild(p);
    chat_cont.appendChild(message_p);
    ul.appendChild(chat_cont);
    ul.flexDirection= "column-reverse";
}

function showCryptInfo(){
    //show crypt html window
    document.getElementById("background_block").style.display = "block";
    document.getElementById("public_key").innerHTML = publicKey_text;
    document.getElementById("room_key").innerHTML = room_key;
}

function hideCryptoInfo(){
    //hide crypt html window
    document.getElementById("background_block").style.display = "none";
}

function sendMessage(){
    var message = document.getElementById("message_text_id").value;
    //remove any characters not in UTF-8
    var re = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
    message = message.replace(re, "");
    //remove text from message input, and reactivate blink
    document.getElementById("message_text_id").value = "";
    document.getElementById("message_text_id").style.animation = "blinker 2s linear infinite";
    //create timestamp
    if(message != ""){
        var d = new Date();
        var timestamp = d.getHours()+":"+d.getMinutes()+":";
        if(d.getSeconds()<10) {
            timestamp = d.getHours()+":"+d.getMinutes()+":0"+d.getSeconds();
        } else {
            timestamp = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        }

        room_id_sub = room_key +" "+socket.id;
        //encrypt data
        room_id_enc = encryptMainPublic(room_id_sub);
        timestamp_enc = encryptRoom(timestamp);
        message_enc = encryptRoom(message);

        //send to socket
        socket.emit('send_message', {"message": message_enc, "room": room_id_enc, "time": timestamp_enc});
    }
}
