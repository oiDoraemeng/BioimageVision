import jwt

def get_token(payload):

    # # 定义payload（载荷），可以包含一些用户信息或权限信息
    # payload = {'user_id': 12345, 'role': 'admin'}

    # 定义密钥，用于签名
    secret_key = 'poiuytrewqasdfghjklmnopqrstuvwxyz'

    # 生成token
    token = jwt.encode(payload, secret_key, algorithm='HS256')

    return token
