$(document).ready(() => {

    hideAlerts = () => {
        const alerts = ['#emptyStocksAlert', '#priceQtyInvalidAlert', '#emptyUserStocksAlert', '#stockQtyInvalidAlert', '#invalidStockSelectionAlert'];
        alerts.forEach(alert => $(alert).hide());
    };

    hideAlerts();
    $('#userHello')[0].innerHTML = $('#userHello')[0].innerHTML.replace('%@USUARIO%@', sessionGet('userLogin').val.name);
    loadUserStocks();
});

$(document).on('click', '.btn-close', e => {
    $(e.currentTarget.parentElement).hide();
});

// Common
function getStockTableRowData(id) {
    const tr = document.getElementById('stock_' + id);
    return {
        id: tr.children[0].innerHTML,
        code: tr.children[1].innerHTML,
        name: tr.children[2].innerHTML,
        value: tr.children[3].innerHTML,
        qty: tr.children[4].innerHTML
    }
}

// Crud - Create
function createUserStock() {
    loadSystemStocks = () => {
        getSystemStocks().then(stocks => {
            stocks[0].forEach(stock => {
                const value = '<option value="' + stock.code + ' / ' + stock.name + ' / ' + stock.price + '">'
                $('#newUserStockListOptions').append(value);
            });
        });
    };

    const modalDom = document.getElementById('newUserStockModal');
    modalDom.addEventListener('shown.bs.modal', () => {
        loadSystemStocks();
    });
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
}

function doCreateUserStock() {

    validateCreateUserStockForm = () => {
        $('#stockQtyInvalidAlert').hide();
        $('#invalidStockSelectionAlert').hide();

        const qty = $('#newUserStockQty').val() || -1;
        const stock = $('#stockSearchDatalist').val();

        if (!stock) {
            $('#invalidStockSelectionAlert').show();
            $('#stockSearchDatalist').focus();
            return false;
        }

        if (qty < 0) {
            $('#stockQtyInvalidAlert').show();
            $('#newUserStockQty').focus();
            return false;
        }

        return true;
    };

    if (validateCreateUserStockForm()) {

        getStockByCode = code => {
            return $.ajax({
                type: 'GET',
                url: 'http://localhost:5000/stock/code/' + code,
                dataType: 'json',
                contentType: 'application/json'
            });
        };

        const stockSplit = $('#stockSearchDatalist').val().split('/');

        getStockByCode(stockSplit[0].trim()).then(stock => {
            if (stock && stock[0]) {

                onSuccessCreateUserStock = loader => {
                    setTimeout(() => {
                        loadUserStocks();
                        bootstrap.Modal.getInstance(document.getElementById('newUserStockModal')).hide();
                        loader.hide();
                    }, 1000);
                };

                onErrorCreateUserStock = (err, loader) => {
                    console.log(err);
                    loader.hide();
                }

                const request = {
                    user: sessionGet('userLogin').val.id,
                    stock: stock[0].id,
                    qty: $('#newUserStockQty').val()
                };
                const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
                loader.show();
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:5000/stock/addStockToUser/',
                    data: JSON.stringify(request),
                    success: onSuccessCreateUserStock(loader),
                    error: err => onErrorCreateUserStock(err, loader),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            }
        });


    }


}

// Crud - Delete
function deleteStock(id) {

    onSuccessDeleteStock = loader => {
        setTimeout(() => {
            $("#stock_" + id).fadeOut(100, function () {
                $("#stock_" + id).remove();
            });
            loadUserStocks();
            loader.hide();
        }, 1000);
    };

    onErrorDeleteStock = err => {
        console.log(err);
        loader.hide();
    };

    const request = {
        user: sessionGet('userLogin').val.id,
        stock: id
    };

    const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
    loader.show();
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:5000/stock/deleteUserStock',
        data: JSON.stringify(request),
        success: onSuccessDeleteStock(loader),
        error: onErrorDeleteStock,
        dataType: 'json',
        contentType: 'application/json'
    });
}

// Crud - Update
function doEditStock() {

    getModalStockValues = () => {
        return {
            id: $("#stockId").val(),
            code: $("#stockCode").val(),
            name: $("#stockName").val(),
            value: $("#stockValue").val() || -1,
            qty: $("#stockQty").val() || -1
        };
    };

    validateStockData = () => {
        const values = getModalStockValues();
        if (values.value < 0) {
            $('#priceQtyInvalidAlert').show();
            $('#stockValue').focus();
            return false;
        }
        if (values.qty < 0) {
            $('#priceQtyInvalidAlert').show();
            $('#stockQty').focus();
            return false;
        }
        return true;
    };

    onSuccessUpdateStock = loader => {
        setTimeout(() => {
            loadUserStocks();
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            loader.hide();
        }, 1000);
    };

    onErrorUpdateStock = (err, loader) => {
        console.log(err);
        loader.hide()
    };

    if (validateStockData()) {
        const request = {
            user: sessionGet('userLogin').val.id,
            stock: getModalStockValues().id,
            qty: getModalStockValues().qty
        };
        const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
        loader.show();
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:5000/stock/updateUserStock',
            data: JSON.stringify(request),
            success: onSuccessUpdateStock(loader),
            error: err => onErrorUpdateStock(err, loader),
            dataType: 'json',
            contentType: 'application/json'
        });
    }

}

function editStock(id) {
    const modalDom = document.getElementById('editModal');
    modalDom.addEventListener('shown.bs.modal', () => {
        const values = getStockTableRowData(id);
        $("#stockId").val(values.id);
        $("#stockCode").val(values.code);
        $("#stockName").val(values.name);
        $("#stockValue").val(values.value);
        $("#stockQty").val(values.qty);
    });
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
}

// Crud - Read
function getSystemStocks() {
    return $.ajax({
        type: 'GET',
        url: 'http://localhost:5000/stock/',
        dataType: 'json',
        contentType: 'application/json'
    });
}

function loadUserStocks() {

    onSuccessLoadStocks = (result, loader) => {
        if (result[0].stocks.length == 0) {
            $('#emptyUserStocksAlert').show();
        } else {
            $('#stocksTableParent').show();
            $('#stocksTable tr').remove();
            result[0].stocks.forEach(stock => {
                const record = '<tr id="stock_' + stock.id + '">'
                    + '<td>' + stock.id + '</td>'
                    + '<td>' + stock.code + '</td>'
                    + '<td>' + stock.name + '</td>'
                    + '<td>' + stock.price + '</td>'
                    + '<td>' + stock.qty + '</td>'
                    + '<td>' + stock.qty * stock.price + '</td>'
                    + '<td><a href="#" onclick="editStock(' + stock.id + ')"/a>Editar</td>'
                    + '<td><a href="#" onclick="deleteStock(' + stock.id + ')"/a>Remover</td>'
                    + '</tr';
                $('#stocksTable').append(record);
            });
        }
        loader.hide();
    };

    onErrorLoadStocks = (err, loader) => {
        console.log(err);
        loader.hide();
    };

    const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
    loader.show();
    getSystemStocks().then(result => {
        $('#stocksTableParent').hide();
        $('#emptyUserStocksAlert').hide();
        if (result[0].length == 0) {
            $('#emptyStocksAlert').show();
            loader.hide();
            return;
        }
        const user = sessionGet('userLogin').val.id;
        const url = 'http://localhost:5000/stock/getUserStocks/' + user;
        $.ajax({
            type: 'GET',
            url,
            success: data => onSuccessLoadStocks(data, loader),
            error: err => onErrorLoadStocks(err, loader),
            dataType: 'json',
            contentType: 'application/json'
        });
    });

}

