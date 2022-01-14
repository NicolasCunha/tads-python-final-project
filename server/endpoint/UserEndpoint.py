from Config import app
from flask import request
from utils import HttpUtils
from service import UserService
from messages import UserMessages


@app.route('/user/login', methods=['post'])
def login():
    request_data = request.get_json()

    response = {"login_ok": False}

    result = UserService.validateUserLoginData(request_data)

    if not result["status"]:
        response["msg"] = UserMessages.VALUE_NOT_FOUND_OR_EMPTY.format(key=result["missing_key"])
        response["login_ok"] = False
        return HttpUtils.createErrorResponse(response)

    user = UserService.tryToLoginUser(request_data["login"], request_data["pwd"])

    response["login_ok"] = True if user else False
    if user:
        response["user"] = [u.to_json() for u in user]

    return HttpUtils.createResponse(response)


@app.route('/user/signup', methods=['post'])
def signup():
    request_data = request.get_json()
    response = {"signup_ok": True}

    result = UserService.validateUserSignupData(request_data)

    if not result["status"]:
        response["msg"] = UserMessages.VALUE_NOT_FOUND_OR_EMPTY.format(key=result["missing_key"])
        response["signup_ok"] = False
        return HttpUtils.createErrorResponse(response)

    # check if user already exists
    result = UserService.userExists(request_data['login'], request_data['email'])

    if result["status"]:
        response["msg"] = UserMessages.USER_EXISTS.format(user=request_data["login"], email=request_data["email"])
        response["signup_ok"] = False
        return HttpUtils.createErrorResponse(response)

    # try to create user in database
    result = UserService.createUser(request_data["login"],
                                    request_data["pwd"],
                                    request_data["email"],
                                    request_data["name"])

    if "error" in result:
        response["msg"] = result["error"]
        response["signup_ok"] = False

    return HttpUtils.createResponse(response)
