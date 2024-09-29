import os
import logging
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Secure way to store and access database credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://ytixpdyyrubi9kz1:qm2qamyabrypa27k@nwhazdrp7hdpd4a4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/c4igi7tpxy3ziyxq'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.urandom(24)  # Generate a secure secret key

db = SQLAlchemy(app)

# Model for the users table
class User(db.Model):
    __tablename__ = 'users'  # Use 'users' table
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # Store hashed passwords

    def __repr__(self):
        return f'<User {self.username}>'

# Uncomment the following line to create the database tables, then comment it out again.
# with app.app_context():
#     db.create_all()

# Route for homepage with both sign-in and sign-up forms
@app.route('/', methods=['GET', 'POST'])
def index():
    logger.debug("Received a request to the index route.")
    
    if request.method == 'POST':
        logger.debug("Processing POST request.")
        
        if request.form.get('signup'):  # Sign-up form submitted
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            confirm_password = request.form['confirm_password']

            logger.debug(f"Sign-up attempt: username={username}, email={email}")

            # Password confirmation check
            if password != confirm_password:
                flash('Passwords do not match!', 'error')
                logger.warning("Password confirmation failed.")
                return render_template('index.html', show_signup=True)

            # Check if user already exists
            existing_user = User.query.filter(or_(User.username == username, User.email == email)).first()
            if existing_user:
                flash('Username or email already exists, please try a different one.', 'error')
                logger.warning("User already exists: username or email conflict.")
                return render_template('index.html', show_signup=True)

            # Hash the password before storing
            hashed_password = generate_password_hash(password)  # Use default method

            # Create a new User instance
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            flash('Successfully signed up!', 'success')
            logger.info("User signed up successfully.")
            return render_template('index.html', show_signup=False)

        elif request.form.get('signin'):  # Sign-in form submitted
            login = request.form['login']
            password = request.form['password']

            logger.debug(f"Sign-in attempt: login={login}")

            # Find user by username or email
            user = User.query.filter(or_(User.username == login, User.email == login)).first()

            # Check if user exists and password is correct
            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                flash('Successfully signed in!', 'success')
                logger.info(f"User signed in successfully: user_id={user.id}")
                return redirect("http://localhost:3000/")  # Redirect to your desired URL
            else:
                flash('Invalid credentials, please try again.', 'error')
                logger.warning("Sign-in failed: invalid credentials.")
                return render_template('index.html', show_signup=False)

    logger.debug("Rendering index.html for GET request.")
    return render_template('index.html', show_signup=False)

# Route for logging out
@app.route('/logout')
def logout():
    session.clear()  # Clear the entire session to log out
    flash('You have been logged out.', 'success')
    logger.info("User logged out.")
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)