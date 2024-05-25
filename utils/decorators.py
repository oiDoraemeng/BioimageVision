from functools import wraps
from flask import g,redirect,url_for

def login_required(func):
    # 保留原函数的名称和文档
    @wraps(func)
    def wrapper(*args, **kwargs) :
        # 这里可以做一些登录验证的操作
        if g.user:
            return func(*args, **kwargs)
        else:
            return redirect(url_for('auth.login'))
    return wrapper
