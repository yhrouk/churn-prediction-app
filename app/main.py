from flask import Flask,request
from flask_restx import Api,Resource,fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import DevConfig
from models import User
from exts import db, jwt


app = Flask(__name__)
app.config.from_object(DevConfig)
db.init_app(app)
jwt.init_app(app)

api = Api(app,doc='/docs')

#model (serializer)
signup_model = api.model(
    "SignUp",
    {
        "username": fields.String(required=True, description="Unique username"),
        "email": fields.String(required=True, description="Unique email address"),
        "password": fields.String(required=True, description="User password")
    }
)
login_model = api.model(
    "Login",
    {
        "username": fields.String(required=True, description="Username"),
        "password": fields.String(required=True, description="Password")
    }
)
# ------------------ Endpoints ------
@api.route('/hello')
class HelloResource(Resource):
  def get(self):
    return {"message":"Hello World"}

@api.route('/signup')
class SignUpResource(Resource):
    @api.expect(signup_model)
    def post(self):
        data = request.get_json()

        # Check existing user
        if User.query.filter_by(username=data.get('username')).first():
            return {"message": "Username already taken"}, 400

        if User.query.filter_by(email=data.get('email')).first():
            return {"message": "Email already registered"}, 400

        # Save new user
        new_user = User(
            username=data.get('username'),
            email=data.get('email')
        )
        new_user.set_password(data.get('password'))
        new_user.save()

        return {"message": "User registered successfully"}, 201

@api.route('/login')
class LoginResource(Resource):
    @api.expect(login_model)
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(username=data.get('username')).first()

        if user and user.check_password(data.get('password')):
            access_token = create_access_token(identity=user.username)
            return {"access_token": access_token}, 200

        return {"message": "Invalid username or password"}, 401

@app.shell_context_processor
def make_shell_context():
    return {"db": db, "User": User}


if __name__ == '__main__' :
  with app.app_context():
        db.create_all()  # Generates sqlite user table automatically
  app.run(host="0.0.0.0", port=5000, debug=True)