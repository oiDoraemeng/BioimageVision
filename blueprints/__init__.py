from blueprints.auth import auth
from blueprints.faq import faq
from blueprints.home import home
from blueprints.analytics import analytics
from blueprints.contact import contact

# 注册蓝图
def register_blueprints(app):
    app.register_blueprint(auth)
    app.register_blueprint(home)
    app.register_blueprint(faq)
    app.register_blueprint(analytics)
    app.register_blueprint(contact)
