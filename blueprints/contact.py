from flask import Blueprint, render_template


contact = Blueprint('contact', __name__,url_prefix='/contact' )

@contact.route('/', methods=['GET', 'POST'])
def index():
    return render_template('contact.html')

