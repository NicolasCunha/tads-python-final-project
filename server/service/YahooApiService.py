import requests

API_KEY = "1eIBElzG3x1Wlonm3H8ye36fapVBBjN81Im1dpoH"

URL_AUTOCOMPLETE = "https://yfapi.net/v6/finance/autocomplete"
URL_QUOTE = "https://yfapi.net/v6/finance/quote"


def autocomplete(query):
    query_string = {"query": query, "lang": "en"}
    headers = {"x-api-key": API_KEY}
    response = requests.request("GET", URL_AUTOCOMPLETE, headers=headers, params=query_string)
    result = []
    if response.text:
        response = response.json()
        if response["ResultSet"]["Result"]:
            response = response["ResultSet"]["Result"]
            query_string = ""
            for stock in response:
                query_string = query_string + stock["symbol"] + ","
                result.append({
                    "code": stock["symbol"],
                    "name": stock["name"]
                })
            stock_quotes = getStockQuotes(query_string)
            quotes = {}
            for quote in stock_quotes:
                quotes[quote["symbol"]] = quote["regularMarketPrice"]
            for stock in result:
                stock["avgPrice"] = quotes[stock["code"]]
    return result


def getStockQuotes(codes):
    query_string = {"symbols": codes}
    headers = {"x-api-key": API_KEY}
    response = requests.request("GET", URL_QUOTE, headers=headers, params=query_string)
    response = response.json()
    if response["quoteResponse"]["result"]:
        return response["quoteResponse"]["result"]
    return []
