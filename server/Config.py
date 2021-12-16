from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
 
# configuracoes
app = Flask(__name__) 

# apply CORS
CORS(app)

# flask port
FLASK_PORT = 5000

# root dir
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# caminho do arquivo de banco de dados 
path = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(path, 'database.db') 

# sqlalchemy 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+DB_FILE

# remover warnings 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
db = SQLAlchemy(app)