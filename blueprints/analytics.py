from flask import Blueprint, render_template, request, redirect, url_for


analytics = Blueprint('analytics', __name__,url_prefix='/analytics' )

@analytics.route('/', methods=['GET', 'POST'])
def index():
    return render_template('analytics.html')

@analytics.route('/software', methods=['GET', 'POST'])
def biomedical():
    return render_template('biomedical.html')