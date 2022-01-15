function closeAllAlerts() {
    const alertsToClose = ['#fieldInvalidAlert', '#fieldPwdNotMatchAlert', '#signupOkAlert', '#userExistsAlert'];
    alertsToClose.forEach(alert => {
        $(alert).hide();
    });
}

function validateFormFields() {
    const fields = ['#username', '#password', '#passwordConfirm', '#email', '#fullname'];

    for (i = 0; i < fields.length; i++) {
        if (!$(fields[i]).val()) {
            $(fields[i]).focus();
            return false;
        }
    }

    const pwd = $('#password').val();
    const pwdConfirm = $('#passwordConfirm').val();

    if (pwd != pwdConfirm) {
        $('#fieldPwdNotMatchAlert').show();
        $('#password').focus();
        return false;
    }

    return true;
}

function handleSucccessRequest(data, modal) {
    modal.hide();
    const result = data[0].signup_ok;
    if (result) {
        $('#signupOkAlert').show();
    } else {
        $('#userExistsAlert').show();
    }
}

function handleErrorRequest(err, modal) {
    alert('Ocorreu um erro!');
    console.log(err);
    modal.hide();
}

function signup() {
    closeAllAlerts();
    if (validateFormFields()) {
        const request = {
            login: $('#username').val(),
            pwd: $('#password').val(),
            email: $('#email').val(),
            name: $('#fullname').val()
        };
        const modal = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
        modal.show();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/user/signup',
            data: JSON.stringify(request),
            success: r => handleSucccessRequest(r, modal),
            error: err => handleErrorRequest(err, modal),
            dataType: 'json',
            contentType: 'application/json'
        });
    } else {
        $('#fieldInvalidAlert').show();
    }
}


$(document).ready(() => {
    closeAllAlerts();
    $('#formSignup').submit(e => {
        e.preventDefault();
    });
    $('#btnSignup').click(() => {
        signup();
    });

});

$(document).on('click', '.btn-close', e => {
    $(e.currentTarget.parentElement).hide();
});