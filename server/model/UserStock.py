from sqlalchemy import ForeignKey

from Config import db


class UserStock(db.Model):
    __tablename__ = 'UserStock'

    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, ForeignKey('User.id'))
    id_stock = db.Column(db.Integer, ForeignKey('Stock.id'))
    qty = db.Column(db.Integer)

    def to_json(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
            'id_stock': self.id_stock,
            'qty': self.qty
        }
