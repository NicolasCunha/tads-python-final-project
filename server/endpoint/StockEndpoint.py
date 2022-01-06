from flask import request

from Config import app
from messages import UserMessages

from utils import HttpUtils
from service import StockService, YahooApiService


@app.route('/stock/', methods=['post'])
def createStock():
    request_data = request.get_json()

    result = StockService.validateStockData(request_data)
    if not result["status"]:
        return HttpUtils.createErrorResponse({
            "msg": UserMessages.VALUE_NOT_FOUND_OR_EMPTY.format(key=result["missing_key"]),
            "create_ok": False
        })

    if StockService.existsStock(request_data["code"]):
        return HttpUtils.createErrorResponse({
            "msg": UserMessages.STOCK_EXISTS.format(code=request_data["code"]),
            "create_ok": False
        })

    result = StockService.createStock(request_data["name"], request_data["code"], request_data["price"])

    return HttpUtils.createResponse(result)


@app.route('/stock', methods=['get'])
def getStocks():
    stocks = StockService.getAllStocks()

    stocks_dict = [stock.to_json() for stock in stocks]

    return HttpUtils.createResponse(stocks_dict)


@app.route('/stock/id/<int:stock_id>', methods=['get'])
def getStockById(stock_id):
    stock = StockService.findStockById(stock_id)

    stock_dict = [it.to_json() for it in stock]

    return HttpUtils.createResponse(stock_dict)


@app.route('/stock/getUserStocks/<int:user_id>', methods=['get'])
def getUserStocks(user_id):
    stocks = StockService.getUserStocks(user_id)

    stock_dict = [it.to_json() for it in stocks]
    stock_list = []
    for stock in stock_dict:
        stock_list.extend(StockService.findStockById(stock["id_stock"]))
    response = {"stocks": [stock.to_json() for stock in stock_list]}
    return HttpUtils.createResponse(response)


@app.route('/stock/code/<string:stock_code>', methods=['get'])
def getStockByCode(stock_code):
    stock = StockService.findStockByCode(stock_code)

    stock_dict = [it.to_json() for it in stock]

    return HttpUtils.createResponse(stock_dict)


@app.route('/stock/addStockToUser', methods=['post'])
def addStockToUser():
    request_data = request.get_json()

    result = StockService.validateStockCreateData(request_data)
    if not result["status"]:
        return HttpUtils.createErrorResponse({
            "msg": UserMessages.VALUE_NOT_FOUND_OR_EMPTY.format(key=result["missing_key"]),
            "create_ok": False
        })

    result = StockService.addStockToUser(request_data["user"], request_data["stock"], request_data["qty"])

    return HttpUtils.createResponse(result)


@app.route('/stock/autocomplete', methods=['post'])
def findStocksYahooApi():
    request_data = request.get_json()

    result = YahooApiService.autocomplete(request_data["query"])

    return HttpUtils.createResponse(result)
