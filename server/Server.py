from Config import app, FLASK_PORT, db

# import all endpoints
from endpoint import *

# create all database tables
db.create_all()
app.run(port=FLASK_PORT, debug=True)
