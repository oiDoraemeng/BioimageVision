from datetime import datetime

from flask import Blueprint, render_template, request,session
from utils.exts import socketio
from flask_socketio import emit,join_room, leave_room
from utils.models import Message



contact = Blueprint('contact', __name__,url_prefix='/contact' )

@contact.route('/', methods=['GET', 'POST'])
def index():
    return render_template('contact.html')
@contact.route('/agent', methods=['GET', 'POST'])
def agent():
    session_id_list = Message.getAllSessionId()
    message_list=[Message.getCurrentMessage({'session_id': session_id}) for session_id in session_id_list]
    return render_template('agent.html', message_list=message_list)

@socketio.on('connect', namespace='/customer')
def handle_customer_connect():
    session_id = session.get('session_id')
    join_room(session_id,namespace='/customer')
    create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    emit('message', {'from_user': 'agent', 'content':'欢迎咨询，请问有什么可以帮助您的？','session_id': session_id, 'create_time': create_time})

    # 发送历史消息记录
    messageID = Message.getMessages({'session_id': session_id})
    for message in messageID:
        emit('message', {'from_user': message.from_user, 'content': message.content,'session_id': session_id, 'create_time': message.create_time})

@socketio.on('customer_message', namespace='/customer')
def handle_customer_message(message):
    Message.save(message)
    emit('message', {'from_user': message["from_user"], 'content': message["content"],'session_id': message["session_id"], 'create_time': message["create_time"]},room=message["session_id"],namespace='/agent')
    # for sid in clients['agents']:
    #     emit('message', message, room=sid,namespace='/agent')

@socketio.on('connect', namespace='/agent')
def handle_agent_connect():

    session_id = request.args.get('sessionId')
    join_room(session_id,namespace='/agent')
    create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    emit('message', {'from_user': 'customer', 'content':'客服已连接，您可以开始接收客户消息','session_id': session_id, 'create_time': create_time})

    # 发送历史消息记录
    messageID = Message.getMessages({'session_id': session_id})
    for message in messageID:
        emit('message',
             {'from_user': message.from_user, 'content': message.content, 'session_id': session_id,'create_time': message.create_time})
@socketio.on('agent_message', namespace='/agent')
def handle_agent_message(message):
    Message.save(message)
    emit('message', {'from_user': message["from_user"], 'content': message["content"],'session_id': message["session_id"], 'create_time': message["create_time"]}, room=message["session_id"],namespace='/customer')
