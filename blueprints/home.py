from flask import Blueprint, render_template, request, redirect, url_for

home = Blueprint('home', __name__,url_prefix='/' )

@home.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@home.route('/profile', methods=['GET', 'POST'])
def profile():
    return render_template('profile.html')

@home.route('/services', methods=['GET', 'POST'])
def services():
    return render_template('services.html')