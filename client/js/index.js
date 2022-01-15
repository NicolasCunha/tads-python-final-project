$(document).ready(() => {
    $('#necessaryLoginAlert').hide();
    if (sessionGet('showNecessaryLoginMsg')) {
        $('#necessaryLoginAlert').show();
        sessionRemove('showNecessaryLoginMsg');
    }
});