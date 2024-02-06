from flask_socketio import SocketIO
from flask import render_template
from flask_socketio import emit
from database import Database
from flask import Flask

db = Database('database.json')
app = Flask(__name__)
socket = SocketIO(app)

# db.set_key("pixels", [0 for i in range(10000)])

@app.route('/')
def app_index():
  return render_template('index.html', pixels=db.get_key('pixels'))

@app.route('/canvas')
def app_canvas():
  return render_template('canvas.html', pixels=db.get_key('pixels'))

@socket.on('PixelChange')
def PixelChange(data):
  p = db.get_key('pixels')
  p[int(data[0])] = data[1]
  db.set_key('pixels', p)
  socket.emit('PixelChange', data)

@socket.on('NewMessage')
def NewMessage(data):
  socket.emit('RecieveMessage', data)

socket.run(app, host='PUBLIC_IP', port=8080, allow_unsafe_werkzeug=True)
