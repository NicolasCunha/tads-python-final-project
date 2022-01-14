if (sessionGet('userLogin') == null) {
    window.location.href = 'index.html';
    sessionSet('showNecessaryLoginMsg', true);
}