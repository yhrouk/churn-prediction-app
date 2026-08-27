from decouple import config
import os
#get the directory where main.py
BASE_DIR= os.path.dirname(os.path.realpath(__file__))
print(os.path.realpath(__file__))
# Navigate up one directory to project root: .../churn-prediction-app/metrics.json
METRICS_PATH = os.path.join(BASE_DIR, "..", "metrics.json")

class Config:
  SECRET_KEY = config('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)

class DevConfig(Config):
  SQLALCHEMY_DATABASE_URI = "sqlite:///"+os.path.join(BASE_DIR,"dev.db")
  DEBUG = True
  SQLALCHEMY_ECHO = True

class ProdConfig(Config):
  pass
class TestConfig(Config):
  pass