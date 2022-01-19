from Config import db
from model.Stock import Stock
from model.UserStock import UserStock
from utils import DictUtils


def findStockById(stockId):
    return db.session.query(Stock).filter(Stock.id == stockId).first()


def findStockByCode(code):
    return db.session.query(Stock).filter(Stock.code == code).first()


def existsStock(code):
    return findStockByCode(code)


def getAllStocks():
    return db.session.query(Stock).all()


def createStock(name, code, price):
    result = {"status": False}
    try:
        stock = Stock(name=name, code=code, price=price)
        db.session.add(stock)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)
    return result


def validateStockData(data):
    return validateData(data, ["name", "code", "price"])


def validateStockCreateData(data):
    return validateData(data, ["user", "stock", "qty"])


def validateData(data, keys):
    result = {"status": True}
    missing_key = DictUtils.findMissingKey(data, *keys)

    if missing_key is not None:
        result["status"] = False
        result["missing_key"] = missing_key
    else:
        key_no_value = DictUtils.keyHasValues(data, *keys)
        if key_no_value is not None:
            result["status"] = False
            result["missing_key"] = key_no_value

    return result


def getUserStocks(user):
    return db.session.query(UserStock).filter(UserStock.id_user == user).all()


def addStockToUser(userId, stockId, qty):
    result = {"status": False}
    try:

        user_stock = db.session.query(UserStock).filter(UserStock.id_user == userId).filter(
            UserStock.id_stock == stockId).first()

        if user_stock:
            user_stock.qty += qty
        else:
            user_stock = UserStock(id_user=userId, id_stock=stockId, qty=qty)
            db.session.add(user_stock)
        db.session.commit()

        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result


def updateUserStock(userId, stockId, qty):
    result = {"status": False}
    try:
        stock = db.session.query(UserStock).filter(UserStock.id_user == userId).filter(
            UserStock.id_stock == stockId).first()
        stock.qty = qty
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result


def deleteUserStock(userId, stockId):
    result = {"status": False}
    try:
        stock = db.session.query(UserStock).filter(UserStock.id_user == userId).filter(
            UserStock.id_stock == stockId).first()
        db.session.delete(stock)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result


def updateStock(stock_id, code, name, price):
    result = {"status": False}
    try:
        stock = db.session.query(Stock).filter(Stock.id == stock_id).first()
        if stock:
            stock.code = code
            stock.name = name
            stock.price = price

        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result


def deleteStock(stock_id):
    result = {"status": False}
    try:
        stock = db.session.query(Stock).filter(Stock.id == stock_id).first()
        db.session.delete(stock)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result
