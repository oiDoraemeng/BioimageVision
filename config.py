from datetime import timedelta

# 语言配置
BABEL_DEFAULT_LOCALE = 'en'
BABEL_DEFAULT_TIMEZONE = 'Asia/Shanghai'
LANGUAGES = ['zh', 'en']

# 数据库配置
# myuser：用户名，用于连接数据库的认证。
# mypassword：密码，与用户名一起用于认证。
# localhost:27017： MongoDB 服务器的地址和端口号。
# mydatabase：要连接的数据库名称。
# authSource=admin：认证数据库的名称。在这里是 admin。
# replicaSet=myreplicaset：复制集的名称，用于连接到一个 MongoDB 复制集。
# ssl=true：指定了连接要使用 SSL。
# MONGO_URI = 'mongodb://myuser:mypassword@localhost:27017/mydatabase?authSource=admin&replicaSet=myreplicaset&ssl=true'

MONGO_URI  = 'mongodb://localhost:27017/bioimagevision'

# 邮箱配置
MAIL_SERVER = "smtp.qq.com"
MAIL_USE_SSL = True  # 启用SSL加密
MAIL_PORT = 465
MAIL_USERNAME = "1914862779@qq.com"
MAIL_PASSWORD = "hykcwtywwxdtdahe"
MAIL_DEFAULT_SENDER = "1914862779@qq.com"  # 默认发件人

# 设置Session
SECRET_KEY = 'poiuytrewqasdfghjklmnopqrstuvwxyz'  # 设置用于加密session数据的密钥
SESSION_TYPE = 'filesystem'  # 设置session存储类型为文件系统
PERMANENT_SESSION_LIFETIME  = timedelta(days=7)  # 设置会话过期时间为7天