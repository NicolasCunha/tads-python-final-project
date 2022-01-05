from flask import request

from Config import app
from messages import UserMessages

from utils import HttpUtils
from service import StockService


@app.route('/stock/', methods=['post'])
def createStock():
    request_data = request.get_json()

    response = {}

    result = StockService.validateStockData(request_data)
    if not result["status"]:
        response["msg"] = UserMessages.VALUE_NOT_FOUND_OR_EMPTY.format(key=result["missing_key"])
        response["create_ok"] = False
        return HttpUtils.createErrorResponse(response)

    if StockService.existsStock(request_data["code"]):
        response["msg"] = UserMessages.STOCK_EXISTS.format(code=request_data["code"])
        response["create_ok"] = False
        return HttpUtils.createErrorResponse(response)

    stock = StockService.createStock(request_data["name"], request_data["code"])

    response["create_ok"] = True if stock else False

    return HttpUtils.createResponse(response)


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


@app.route('/stock/code/<string:stock_code>', methods=['get'])
def getStockByCode(stock_code):
    stock = StockService.findStockByCode(stock_code)

    stock_dict = [it.to_json() for it in stock]

    return HttpUtils.createResponse(stock_dict)
