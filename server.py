from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import gevent.monkey
gevent.monkey.patch_all()
from Crypto import Random
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from base64 import b64decode, b64encode
import base64

app = Flask(__name__, template_folder="tmp")

app.config['SECRET_KEY'] = 'secret!'

#generate keys
private_key = RSA.generate(2048)
public_key = private_key.publickey()


def decryptRSA(rsa, key):
	cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
	return cipher.decrypt(b64decode(rsa))

socketio = SocketIO(app)

users = {}
logs = {}
id_bind = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join-room')
def joinRoom(data):
	#encryptio
	io_id = request.sid;

	room_name = decryptRSA(data.split(":")[0], private_key).decode("utf-8").split()[0]
	tmp_io_id = decryptRSA(data.split(":")[0], private_key).decode("utf-8").split()[1]
	if(tmp_io_id != io_id):
		return
	user_id = data.split(":")[1]

	print("[SERVER] Someone joined room "+room_name+"!")

	if(room_name not in users.keys()):
		users[room_name] = []
	username = user_id	
	users[room_name].append(username)
	if(room_name in logs.keys()):
		return_data = {"log": logs[room_name], "users": users[room_name]}
	else: 
		logs[room_name] = [];
		return_data = {"log": [], "users": users[room_name]}
	id_bind[io_id] = username
	join_room(room_name)
	emit("connected", return_data, room=io_id)
	emit("new_user", username, room=room_name, include_self=False)

@socketio.on('disconnect_user')
def disconnect(data):
	try:
		room_name = decryptRSA(data["roomname"], private_key).decode("utf-8")
		users[room_name].remove(id_bind[request.sid])
		leave_room(room_name)
		emit("user_left",id_bind[request.sid], room=room_name)
		print("[SERVER] Someone left room "+room_name+"!")
	except:
		print("Error on disconnect!")

@socketio.on('send_message')
def sendMessage(data):
	io_id = request.sid;

	room_name = decryptRSA(data["room"], private_key).decode("utf-8").split()[0]
	tmp_io_id = decryptRSA(data["room"], private_key).decode("utf-8").split()[1]
	if(tmp_io_id != io_id):
		return
	message = data["message"]
	time = data["time"]

	logs[room_name].insert(0, [id_bind[request.sid], message, time])
	if(len(logs[room_name]) > 35):
		logs[room_name].pop(len(logs[room_name])-1)
	return_data = {"user_id": id_bind[request.sid], "message": message, "time": time}	
	emit("get_message", return_data, room=room_name)

@socketio.on("get_public_key")
def return_key():
	io_id = request.sid;
	emit("send_public_key", public_key.exportKey().decode("utf-8"), room=io_id)

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000)	
