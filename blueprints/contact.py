from flask import Blueprint, render_template, request,g
from utils.exts import socketio
from flask_socketio import emit,join_room, leave_room
from bson.objectid import ObjectId


# 存储客户端和客服端的连接
clients = {
    'customers': set(),
    'agents': set()
}

contact = Blueprint('contact', __name__,url_prefix='/contact' )

@contact.route('/', methods=['GET', 'POST'])
def index():
    return render_template('contact.html')
@contact.route('/agent', methods=['GET', 'POST'])
def agent():
    return render_template('agent.html')

@socketio.on('connect', namespace='/customer')
def handle_customer_connect():
    session_id = g.session_id
    clients['customers'].add(request.sid)
    emit('message', '欢迎咨询，请问有什么可以帮助您的？')

@socketio.on('customer_message', namespace='/customer')
def handle_customer_message(message):
    for sid in clients['agents']:
        emit('message', message, room=sid,namespace='/agent')

@socketio.on('connect', namespace='/agent')
def handle_agent_connect():
    clients['agents'].add(request.sid)
    emit('message', '客服已连接，您可以开始接收客户消息')

@socketio.on('agent_message', namespace='/agent')
def handle_agent_message(message):
    for sid in clients['customers']:
        emit('message',message, room=sid,namespace='/customer')
