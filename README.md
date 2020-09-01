# SocketIO-Chatsite
Chatsite with rooms, created with Socket IO and Flask using a Public Key Infrastructure (AES and RSA).

<p>How it works.</p>

<p> When entering the site, you will have to chose a roomname and a username. <br>
  If a room already exists with your chosen name, then you will join that room and see <br>
  messages sent in that room and current users. If the rooms doesnt not already exist, then <br>
  you will automatically create a new room and join that one. If you want people to join your room <br>
  simply give them the roomname. If your chosen username is already in use, a number will be added behind <br>
  your chosen username. Like: Username -> Username4.
  </p>

<h3>Rooms: </h3>
<p> The roomname will act as a password. If you want to have a private conversation <br>
  you should chose a difficult roomname (not 123). Only people that know the roomname <br>
  will be able to join it. When clicking the roomname input box the text "room-" will be added <br>
  infront of your input that is to make short roomname a bit longer for more safe encryption. <br>
  You can of course remove the "room-" and name the room whatever you wish.</p>

<h3>Encryption: </h3>
<p> Temp text </p>

![alt text](https://github.com/joexbayer/SocketIO-Chatsite/blob/master/static/styles/encryption.png?raw=true)

<h3>Anti XSS and request forgery: </h3>
<p> When entering a room, two opentions will be available one to filter special characters and one for links. <br>
<ol>
  <li>The first one will remove any charactrs that might be used to inject scripts. Characters like !, ?, . and , <br>
    are of course still allowed. Text that was filtered with have a label accordingly.</li>
  <li>The last option is to filter any messages that include traces of a link, that means "https:// or "www" <br>
<b style="color:red;">Note that in this case the message will not be shown at all. Just a label saying that a link was posted!</b></li>
</ol>
</p>

