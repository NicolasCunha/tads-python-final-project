from Config import db


class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(255))
    pwd = db.Column(db.String(255))
    email = db.Column(db.String(255))
    person_name = db.Column(db.String(255))

    def to_json(self):
        return {
            'id': self.id,
            'login': self.login,
            'pwd': self.pwd,
            'email': self.email
        }
