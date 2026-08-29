from flask import Flask,request
from flask_restx import Api,Resource,fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import DevConfig
from models.User import User
from exts import db, jwt
from services import predict_churn
import json
import os
from config import METRICS_PATH
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(DevConfig)
db.init_app(app)
jwt.init_app(app)
# Enable CORS for all routes (allows React dev server at localhost:5173)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Swagger with JWT authorization support
authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type 'Bearer <your_token>'"
    }
}

api = Api(
    app, 
    doc='/docs', 
    title="Churn Prediction API", 
    authorizations=authorizations,
    security='Bearer'
)
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
# Request schema for prediction input
predict_model = api.model(
    "PredictInput",
    {
        "Tenure Months": fields.Integer(required=True, example=12),
        "Monthly Charges": fields.Float(required=True, example=70.35),
        "Total Charges": fields.Float(required=True, example=844.20),
        "Contract": fields.String(required=True, example="Month-to-month"),
        "Payment Method": fields.String(required=True, example="Electronic check")
    }
)
# ------------------ Endpoints ------
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

@api.route('/predict')
class PredictResource(Resource):
    @jwt_required()
    @api.expect(predict_model)
    def post(self):
        """Predict customer churn using saved Random Forest model."""
        data = request.get_json()

        if not data:
            return {'message': 'Invalid request payload'}, 400

        # Map snake_case frontend keys to match model DataFrame expectations
        model_input = {
            'tenure': data.get('tenure'),
            'Monthly Charges': data.get('monthly_charges'),
            'Contract': data.get('contract')
        }

        try:
            # 1. Execute inference function
            result = predict_churn(model_input)
            prob = result["churn_probability"]

            # 2. Determine risk tier
            if prob >= 0.7:
                risk_level = 'HIGH'
            elif prob >= 0.3:
                risk_level = 'MEDIUM'
            else:
                risk_level = 'LOW'

            # 3. Return keys matching React PredictResponse interface
            return {
                'probability': prob,
                'churn': bool(result["churn_prediction"]),
                'risk_level': risk_level
            }, 200

        except Exception as e:
            return {'message': f'Prediction engine error: {str(e)}'}, 500

@api.route('/metrics')
class MetricsResource(Resource):
    @jwt_required()
    def get(self):
        """Get precomputed model performance metrics across thresholds."""
        if not os.path.exists(METRICS_PATH):
            return {"error": "metrics.json not found. Run model training script first."}, 404
        with open("./metrics.json", "r") as f:
            metrics_data = json.load(f)
        return metrics_data, 200

@api.route('/about')
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {"username": current_user}, 200

@app.shell_context_processor
def make_shell_context():
    return {"db": db, "User": User}


if __name__ == '__main__' :
  with app.app_context():
        db.create_all()  # Generates sqlite user table automatically
  app.run(host="0.0.0.0", port=5000, debug=True)