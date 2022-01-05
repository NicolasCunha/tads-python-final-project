from Config import db
from sqlalchemy import or_
from model.User import User
from utils import DictUtils


def userExists(login, email):
    result = {"status": False}

    try:
        user = db.session.query(User).filter(or_(User.login == login, User.email == email)).all()
        result["status"] = True if user else False
    except Exception as ex:
        result["error"] = str(ex)

    return result


def createUser(login, pwd, email, name):
    result = {"status": False}
    try:
        user = User(login=login, pwd=pwd, email=email, person_name=name)
        db.session.add(user)
        db.session.commit()
        result["status"] = True
    except Exception as ex:
        result["error"] = str(ex)

    return result


def validateUserSignupData(data):
    return validateUserData(data, ["login", "pwd", "email", "name"])


def validateUserLoginData(data):
    return validateUserData(data, ["login", "pwd"])


def validateUserData(data, keys):
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


def tryToLoginUser(login, pwd):
    return db.session.query(User).filter(User.login == login).filter(
        User.pwd == pwd).all()
