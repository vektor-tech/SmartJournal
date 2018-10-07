# main backend entry point

import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, session, send_file, redirect
from flask_session import Session
from models import *
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required, get_dict_array, get_dict

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
    return send_file("templates/index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    # login page handling

    # forget current user
    session.clear()

    # a post request
    if request.method == 'POST':
        # Ensure form was filled
        if not request.form.get('username'):
            return redirect("/login")
        elif not request.form.get('password'):
            return redirect("/login")

        # query db for user
        user = User.query.filter_by(username=request.form.get('username')).first()

        # check username exists & password match
        if user is None or not check_password_hash(user.password, request.form.get('password')):
            return redirect("/login")

        # remember id
        session['user_id'] = user.id

        return redirect("/")

    else:
        # get request
        return send_file("templates/login.html")

@app.route("/logout")
def logout():
    # log user out

    # clear session var
    session.clear()

    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():
    # sign up user

    # clear any user
    session.clear()

    # post request 
    if request.method == 'POST':

        # ensure params are passed
        if not request.form.get('username'):
            return redirect("/register")
        elif not request.form.get('password') or not request.form.get('confirmation'):
            # Ensure password was submitted
            return redirect("/register")
        elif request.form.get('password') != request.form.get('confirmation'):
            return redirect("/register")

        # query db for user
        user = User.query.filter_by(username=request.form.get('username')).first()

        # user with username already exists
        if user:
            return redirect("/register")

        # make new user in db
        new = User(request.form.get('username'), generate_password_hash(request.form.get('password')))
        db.session.add(new)
        db.session.commit()

        # save user login
        session['user_id'] = new.id

        return redirect("/")
    
    else:
        # send register page
        return send_file("templates/register.html")


# api routes config

@app.route("/api/entry", methods=["GET", "POST"])
def entry_api():

    # check for signin

    # if session.get('user_id') is None:
    #     return jsonify({"success": False, "message": "Not logged in!"})

    if request.method == "POST":
        # add entry to db
        data = request.get_json()

        # default timeframe
        t_from = datetime.utcnow()
        t_to = datetime.utcnow()
        
        # edit for last hour
        t_from.replace(hour=t_from.hour-1)

        # edit if params given
        if 'from' in data:
            t_from = data['from']
        if 'to' in data:
            t_to = data['to']

        # convert params to datetime
        try: 
            t_from = datetime.fromtimestamp(int(t_from), timezone.utc)
            t_to = datetime.fromtimestamp(int(t_to), timezone.utc)
        except:
            print("error on time conversion or out of bound")
            return jsonify({"success": False, "message": "Intervals invalid!"})

        # round to nearest hour
        t_from.replace(microsecond=0, second=0, minute=0)
        t_to.replace(microsecond=0, second=0, minute=0)

        # add the entries
        # TODO
        print(t_from, t_to) 

        return jsonify({"success": True})

    else:
        # default timeframe
        t_from = 0
        t_to = datetime.utcnow().timestamp()

        # save params if given
        if request.args.get('from'):
            t_from = request.args.get('from')
        if request.args.get('to'):
            t_to = request.args.get('to')

        # convert interval to datetime
        try: 
            t_from = datetime.fromtimestamp(int(t_from), timezone.utc)
            t_to = datetime.fromtimestamp(int(t_to), timezone.utc)
        except:
            print("error on time conversion or out of bound")
            return jsonify({"success": False, "message": "Intervals invalid!"})
        
        # get current user
        user = User.query.get(session['user_id'])

        # filter with time
        entries = user.entries.filter(Entry.time >= t_from, Entry.time <= t_to).all()

        return jsonify({"success": True, "entries": get_dict_array(user.entries)})


@app.route("/api/tag", methods=["GET", "POST"])
def tag_api():

    # check for signin

    if session.get('user_id') is None:
        return jsonify({"success": False, "message": "Not logged in!"})

    # process request

    if request.method == "POST":
        # add tag to db
        data = request.get_json()

        tag = Tag(data['name'])
        db.session.add(tag)
        db.session.commit()

        return jsonify({"success": True, "tag": get_dict(tag)})

    else:
        # get tags
        tags = Tag.query.all()

        return jsonify({"success": True, "tags": get_dict_array(tags)})
    

if __name__ == "__main__":
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run(debug=True, use_reloader=True)
