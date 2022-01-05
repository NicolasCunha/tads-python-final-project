from Config import db
from model.Stock import Stock
from utils import DictUtils


def findStockById(id):
    return db.session.query(Stock).filter(Stock.id == id).all()


def findStockByCode(code):
    return db.session.query(Stock).filter(Stock.code == code).all()


def existsStock(code):
    return len(findStockByCode(code)) > 0


def getAllStocks():
    return db.session.query(Stock).all()


def createStock(name, code):
    result = {"status": False}
    try:
        stock = Stock(name=name, code=code)
        db.session.add(stock)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)
    return result


def validateStockData(request):
    keys = ["name", "code"]
    result = {"status": True}
    missing_key = DictUtils.findMissingKey(request, *keys)

    if missing_key is not None:
        result["status"] = False
        result["missing_key"] = missing_key
    else:
        key_no_value = DictUtils.keyHasValues(request, *keys)
        if key_no_value is not None:
            result["status"] = False
            result["missing_key"] = key_no_value

    return result
