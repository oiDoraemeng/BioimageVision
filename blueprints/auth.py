from flask import Blueprint, render_template, request, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message
import random
import string

from utils.models import User
from utils.token import get_token
from utils.exts import mail # 导入 mail 对象
from utils.forms import registerForm, loginForm
# 创建蓝图对象
auth = Blueprint( 'auth', __name__, url_prefix='/auth' )



@auth.route('/send_code/', methods=['GET', 'POST'])
def send_code():
    # 获取邮箱地址
    email = request.args.get('email')
    # 生成随机六位验证码
    code = ''.join(random.choices(string.digits, k=6))
    message = Message(subject='验证码', recipients=[email], body=f'您好，您的验证码为：{code}')
    mail.send(message)
    # 将验证码存储到 session 中 / memcache 中 / redis 中
    session['code'] = code
    return '邮件发送成功'

# 注册页面
@auth.route( '/register/', methods=['POST', "GET"] )
def register():
    if request.method == 'POST':
        form = registerForm(request.form)
        if form.validate():
            name = request.form['name']
            password = request.form['password']  # 密码需要加密存储
            email = request.form['email']
            payload = {'username': name, 'password': generate_password_hash(password)}
            token = get_token(payload)
            data = {'name': name,
                    "email": email,
                    'password': generate_password_hash(password),
                    'token': token
                    }

            User.save(data)
            return redirect(url_for('auth.login'))
        else:
            [flash(error[0]) for error in form.errors.values()]
            return redirect(request.referrer)

    else:  # 如果是 GET 请求
        return render_template( 'register.html' )


# 登录页面
@auth.route( '/login/', methods=['POST', 'GET'] )
def login():
    print( request.method )
    if request.method == 'POST':
        form = loginForm(request.form)
        if form.validate():
            email = request.form['email']
            password = request.form['password']
            user = User.getUser({'email': email})
            if not user or not check_password_hash(user.password, password):
                flash('邮箱或密码无效')
            else:
                # cookie 适合存储少量数据,一般用来存放登录授权
                session['user_id'] = user._id



            # session['user_id'] =
        #     if 'is_admin' in user_data:
        #         flash("管理员已登录")
        #         # return render_template('hello.html', username=username,user_data=user_data)
        #         return redirect(url_for('hello', username=username))
        #     else:
        #
        #         return redirect(url_for('hello', username=username))
        # else:
        #     [flash(error[0]) for error in form.errors.values()]
                return redirect(url_for('home.index'))
    else:  # 如果是 GET 请求
        return render_template( 'login.html')

# 忘记密码
@auth.route('/reset_password/', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form['email']
        user = User.getUser({'email': email})
        if user:
            pass
# 个人中心
@auth.route('/personal/',methods=['GET','POST'])
def personal():
    return render_template('personal.html')

# 注销登录
@auth.route('/logout/')
def logout():
    session.pop('user_id', None)
    return redirect(request.referrer)

# 隐私政策
@auth.route("/privacy_policy")
def privacy_policy():
    return render_template("policy.html")

@auth.route('/contact/')
def contact():
    return render_template('contact.html')
