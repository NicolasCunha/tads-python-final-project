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

// Crud - Delete

function deleteStock(id) {

    onSuccessDeleteStock = loader => {
        setTimeout(() => {
            $("#stock_" + id).fadeOut(100, function () {
                $("#stock_" + id).remove();
            });
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

function loadUserStocks() {

    onSuccessLoadStocks = result => {
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
                    + '<td>' + stock.qty * stock.price + '</td>'
                    + '<td><a href="#" onclick="editStock(' + stock.id + ')"/a>Editar</td>'
                    + '<td><a href="#" onclick="deleteStock(' + stock.id + ')"/a>Remover</td>'
                    + '</tr';
                $('#stocksTable').append(record);
            });
        }
    };

    onErrorLoadStocks = err => {
        console.log(err);
    };

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

$(document).ready(() => {

    hideAlerts = () => {
        const alerts = ['#emptyStocksAlert', '#priceQtyInvalidAlert'];
        alerts.forEach(alert => $(alert).hide());
    };

    hideAlerts();
    $('#userHello')[0].innerHTML = $('#userHello')[0].innerHTML.replace('%@USUARIO%@', sessionGet('userLogin').val.name);
    loadUserStocks();
});

$(document).on('click', '.btn-close', e => {
    $(e.currentTarget.parentElement).hide();
});