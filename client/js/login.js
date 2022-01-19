function handleSucccessRequest(result, modal) {
    if (result[0].login_ok) {
        const user = result[0].user[0];
        user.pwd = null;
        sessionSet('userLogin', user);
        window.location.href = 'index.html';
    } else {
        $('#loginFailAlert').show();
    }
    modal.hide();
}

function handleErrorRequest(err, modal) {
    alert('Ocorreu um erro!');
    console.log(err);
    modal.hide();
}

function login() {
    const modal = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
    modal.show();
    const user = $('#username').val()
    const pwd = $('#password').val()
    const request = {
        login: user,
        pwd
    };
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/user/login',
        data: JSON.stringify(request),
        success: r => handleSucccessRequest(r, modal),
        error: err => handleErrorRequest(err, modal),
        dataType: 'json',
        contentType: 'application/json'
    });
}

$(document).ready(() => {
    $('#loginFailAlert').hide();
    $('#formLogin').submit(e => {
        e.preventDefault();
    });

    $('#btnLogin').click(event => {
        login();
    });
});

$(document).on('click', '.btn-close', e => {
    $(e.currentTarget.parentElement).hide();
});

