function deleteStock(id) {
    console.log('Deleting stock id ' + id);
}

function editStock(id) {
    console.log('Editing stock id ' + id);
}

function onSuccessLoadStocks(result) {
    if (result[0].stocks.length == 0) {
        $('#stocksTable').hide();
        $('#emptyStocksAlert').show();
    } else {
        $('#stocksTable tr').remove();
        result[0].stocks.forEach(stock => {
            const record = '<tr id="stock_' + stock.id + '">'
                + '<td>' + stock.id + '</td>'
                + '<td>' + stock.code + '</td>'
                + '<td>' + stock.name + '</td>'
                + '<td>' + stock.price + '</td>'
                + '<td>' + stock.qty + '</td>'
                + '<td><a href="#" onclick="editStock(' + stock.id + ')"/a>Editar</td>'
                + '<td><a href="#" onclick="deleteStock(' + stock.id + ')"/a>Remover</td>'                
                + '</tr';
            $('#stocksTable').append(record);
        });
    }
}

function onErrorLoadStocks(err) {
    console.log(err);
}

function loadUserStocks() {
    const user = sessionGet('userLogin').val.id;
    const url = 'http://localhost:5000/stock/getUserStocks/' + user;
    $.ajax({
        type: 'GET',
        url,
        success: onSuccessLoadStocks,
        error: onErrorLoadStocks,
        dataType: 'json',
        contentType: 'application/json'
    });
}

function replaceUserMacro() {
    $('#userHello')[0].innerHTML = $('#userHello')[0].innerHTML.replace('%@USUARIO%@', sessionGet('userLogin').val.name);
}

$(document).ready(() => {
    $('#emptyStocksAlert').hide();
    replaceUserMacro();
    loadUserStocks();
});

$(document).on('click', '.btn-close', e => {
    $(e.currentTarget.parentElement).hide();
});