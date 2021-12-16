from flask import jsonify

HTTP_OK = 200
HTTP_ERR = 500


def createResponse(response_dict, status=HTTP_OK):
    response = jsonify(response_dict, status)
    response.status = status
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def createErrorResponse(response_dict):
    return createResponse((response_dict, HTTP_ERR))
