from utils import StringUtils


def keyHasValue(dict_ref, key):
    return key in dict_ref and not StringUtils.isStringEmpty(dict_ref[key])


def keyHasValues(dict_ref, *keys):
    result = None
    for key in keys:
        key_has_value = keyHasValue(dict_ref, key)
        if not key_has_value:
            result = key
            break
    return result


def findMissingKey(dict_ref, *keys):
    result = None
    for key in keys:
        if key not in dict_ref:
            result = key
            break

    return result
