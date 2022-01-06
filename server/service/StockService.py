from Config import db
from model.Stock import Stock
from model.UserStock import UserStock
from utils import DictUtils


def findStockById(stockId):
    return db.session.query(Stock).filter(Stock.id == stockId).all()


def findStockByCode(code):
    return db.session.query(Stock).filter(Stock.code == code).all()


def existsStock(code):
    return len(findStockByCode(code)) > 0


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
        user_stock = UserStock(id_user=userId, id_stock=stockId, qty=qty)
        db.session.add(user_stock)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result
