$(document).ready(() => {
    $('.alert').hide();
    if (sessionGet('showNecessaryLoginMsg')) {
        $('.alert').show();
        sessionRemove('showNecessaryLoginMsg');
    }
});