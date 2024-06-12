from bson import ObjectId
import uuid
from flask import Flask, request, session,g
from flask_session import Session  # 导入Session扩展

import config
from utils.exts import mail,mongo,babel,cors,socketio
from blueprints import register_blueprints
from utils.filters import datetime_format, Msgdatetime_format
from utils.models import User

def create_app():

    def get_locale():
        # user = getattr(g, 'user', None)
        # if user is not None:
        #     return user.locale
        lang = request.args.get('lang')  # 获取 lang 参数
        if lang in app.config['LANGUAGES']:  # 检查是否是支持的语言
            return lang
        return request.accept_languages.best_match(app.config.get('LANGUAGES'))


    def get_timezone():
        user = getattr(g, 'user', None)
        if user is not None:
            return user.timezone

    def configure_extensions(app):
        # 加载扩展
        cors.init_app(app)
        mail.init_app(app)
        mongo.init_app(app)
        socketio.init_app(app)
        babel.init_app(app, locale_selector=get_locale, timezone_selector=get_timezone)
        Session(app)

    app = Flask(__name__)
    app.secret_key = 'poiuytrewqasdfghjklmnopqrstuvwxyz'

    # 加载配置
    app.config.from_object(config)

    # 注册蓝图
    register_blueprints(app)

    configure_extensions(app)

    # 添加过滤器 过滤器的名字时dformat
    app.add_template_filter(datetime_format, 'dformat')
    app.add_template_filter(Msgdatetime_format, 'Msgformat')

    @app.before_request
    def before_request():
        try:
            # 记录访问日志
            print(f"Request URL: {request.url}")
            if 'session_id' not in session:
                session['session_id'] = str(uuid.uuid4())
                print(f"New session_id generated: {session['session_id']}")
            else:
                print(f"Existing session_id: {session['session_id']}")
        except Exception as e:
            print(f"Error in before_request: {e}")

    @app.context_processor
    def context_processor():
        # 给模板添加全局变量
        return {'session_id': session.get('session_id')}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
