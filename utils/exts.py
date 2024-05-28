from flask_mail import Mail
from flask_pymongo import PyMongo
from flask_babel import Babel
from flask_cors import CORS
from flask_socketio import SocketIO


# 连接MongoDB数据库
# client = pymongo.MongoClient('mongodb://localhost:27017/')
# # 指定连接的数据库 指定集合
# database1 = client.student
# collection_score = database1.score
# collection_user = database1.user
#
# database2 = client.taobao
# collection_purchase = database2.purchase

# # 将用户添加到管理员集合
# if not collection_user.find_one({'is_admin': True}):
#     collection_user.insert_one({'username': "root", 'password': generate_password_hash('123456'), 'is_admin': True})
mongo = PyMongo()
mail = Mail()
babel = Babel()
cors = CORS()
socketio = SocketIO()
