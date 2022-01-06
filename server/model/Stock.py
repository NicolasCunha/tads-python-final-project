from Config import db


class Stock(db.Model):
    __tablename__ = 'Stock'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    code = db.Column(db.String(255))
    price = db.Column(db.Float)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'price' : self.price
        }
