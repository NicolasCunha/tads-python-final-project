function sessionSet(id, val, expireHour = 1) {
    sessionStorage.setItem(id, JSON.stringify({
        val,
        expiresOn: Date.now() + expireHour * 60 * 60 * 1000
    }));
};

function sessionGet(id) {
    const sessionData = sessionStorage.getItem(id)
    if (sessionData == null) {
        return null;
    }
    const dataParsed = JSON.parse(sessionData)
    if (Date.now() > dataParsed.expiresOn) {
        sessionStorage.removeItem(id);
        return null;
    }
    return dataParsed;
};