# main backend entry point

import os
import datetime

from flask import Flask, jsonify, request, session, send_file
from flask_session import Session
from models import *
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

app = Flask(__name__)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


# page routes config

@app.route("/")
@login_required
def index():
    # main app
    return "Hello, world!"

@app.route("/login", methods=["GET", "POST"])
def login():
    # login page handling

    # forget current user
    session.clear()

    # a post request
    if request.method == 'POST':
        # Ensure form was filled
        if not request.form.get('username'):
            flash("Must provide Username!")
            return "HAHA"
        elif not request.form.get('password'):
            flash("Password not provided!")
            return "HAHA"

        # query db for user
        user = User.query.filter_by(username=request.form.get('username')).first()

        # check username exists & password match
        if user is None or not check_password_hash(user.password, request.form.get('password')):
            return "INVALID PASSWORD"

        # remember id
        session['user_id'] = user.id

        return "LOGGED IN"

    else:
        # get request
        return "LOGIN PAGE"

@app.route("/logout")
def logout():
    # log user out

    # clear session var
    session.clear()

    return "LOGGED OUT"

@app.route("/register", methods=["GET", "POST"])
def register():
    # sign up user

    # clear any user
    session.clear()

    # post request 
    if request.method == 'POST':

        # ensure params are passed

        # query db for user
        user = User.query.filter_by(username=request.form.get('username')).first()

        # user with username already exists
        if user:
            return "PICK DIFFERENT USERNAME"

        # make new user in db
        new = User(username, generate_password_hash(password))
        db.session.add(new)
        db.session.commit()

        # save user login
        session['user_id'] = new.id

        return "REGISTERED"
    
    else:
        # send register page
        return "REGISTER PAGE"


# api routes config

@app.route("/api/stats")
def stats_api():

    # check for signin

    if session['user_id'] is None:
        return jsonify({success: False, message="Not logged in!"})

    # default timeframe
    t_from = datetime.datetime(0,0,0)
    t_to = datetime.datetime.now()
    
    request.args.get('from')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, use_reloader=True)
