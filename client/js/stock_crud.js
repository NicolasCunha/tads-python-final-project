$(document).ready(() => {
    hideAlerts = () => {
        const alerts = ['#emptyStocksAlert', '#nameNotEmptyAlert', '#codeNotEmptyAlert', '#priceInvalidAlert', '#newStockCodeNotEmptyAlert', '#newStockNameNotEmptyAlert', '#newStockPriceInvalidAlert', '#newStockAutocompleteTooShortAlert'];
        alerts.forEach(alert => $(alert).hide());
    };
    hideAlerts();
    $('#userHello')[0].innerHTML = $('#userHello')[0].innerHTML.replace('%@USUARIO%@', sessionGet('userLogin').val.name);
    loadDatabaseStocks();
    $("#stockSearchDatalist").keydown(key => stockAutoComplete(key));
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
function createStock() {
    clearFormFields = () => {
        const fields = ['#stockSearchDatalist', '#newStockCode', '#newStockName', '#newStockValue'];
        fields.forEach(field => $(field).val(''));
    };

    clearFormFields();
    const modalDom = document.getElementById('newStockModal');
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
}

function stockAutoComplete(key) {
    
    onSuccessAutoComplete = (data, loader) => {
        console.log(data);
        loader.hide();
    };

    onErrorAutoComplete = (err, loader) => {
        console.log(err);
        loader.hide();
    }
    
    $('#newStockAutocompleteTooShortAlert').hide();
    if (key.which == 13) {
        const value = $('#stockSearchDatalist').val() || '';
        if (value.length < 3) {
            $('#newStockAutocompleteTooShortAlert').show();
        } else {
            const request = {
                'query': value.toLowerCase()
            };
            const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
            loader.show();
            $.ajax({
                type : 'POST',
                url : 'http://localhost:5000/stock/autocomplete',
                data : JSON.stringify(request),
                success : data => onSuccessAutoComplete(data, loader),
                error : error => onErrorAutoComplete(error, loader),
                dataType : 'json',
                contentType : 'application/json'
            });
        }
    }
};

// Crud - Update
function editStock(id) {

    getModalStockValues = () => {
        return {
            id: $("#stockId").val(),
            code: $("#stockCode").val(),
            name: $("#stockName").val(),
            value: $("#stockValue").val() || -1
        };
    };

    const modalDom = document.getElementById('editModal');
    modalDom.addEventListener('shown.bs.modal', () => {
        const values = getStockTableRowData(id);
        $("#stockId").val(values.id);
        $("#stockCode").val(values.code);
        $("#stockName").val(values.name);
        $("#stockValue").val(values.value);
    });
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
}

function doEditStock() {

    validateStockData = () => {
        const values = getModalStockValues();
        console.log(values);
        if (!values.code) {
            $("#codeNotEmptyAlert").show();
            $('#stockCode').focus();
            return false;
        }
        if (!values.name) {
            $('#nameNotEmptyAlert').show();
            $('#stockName').focus();
            return false;
        }
        if (values.value < 0) {
            $('#priceQtyInvalidAlert').show();
            $('#stockValue').focus();
            return false;
        }
        return true;
    };

    onSuccessUpdateStock = loader => {
        setTimeout(() => {
            loadDatabaseStocks();
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            loader.hide();
        }, 1000);
    };

    onErrorUpdateStock = (loader, err) => {
        console.log(err);
        loader.hide()
    };

    if (validateStockData()) {
        const values = getModalStockValues();
        const request = {
            id: values.id,
            code: values.code,
            name: values.name,
            price: values.value
        };

        const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
        loader.show();
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:5000/stock/',
            data: JSON.stringify(request),
            success: onSuccessUpdateStock(loader),
            error: err => onErrorUpdateStock(err, loader),
            dataType: 'json',
            contentType: 'application/json'
        });
    }

}

// Crud - Delete

function deleteStock(id) {
    console.log('Deleting stock ' + id);

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
        id
    };

    const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
    loader.show();
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:5000/stock/',
        data: JSON.stringify(request),
        success: onSuccessDeleteStock(loader),
        error: onErrorDeleteStock,
        dataType: 'json',
        contentType: 'application/json'
    });

}

// Crud - Read

function loadDatabaseStocks() {

    onSuccessLoadStocks = (data, loader) => {
        const stocks = data[0];
        const tableParent = $('#stocksTableParent');

        if (stocks.length == 0) {
            $('#emptyStocksAlert').show();
            tableParent.hide();
        } else {
            tableParent.show();
            const table = $('#stocksTable')
            $('#stocksTable tr').remove();
            stocks.forEach(stock => {
                const record = '<tr id="stock_' + stock.id + '">'
                    + '<td>' + stock.id + '</td>'
                    + '<td>' + stock.code + '</td>'
                    + '<td>' + stock.name + '</td>'
                    + '<td>' + stock.price + '</td>'
                    + '<td><a href="#" onclick="editStock(' + stock.id + ')"/a>Editar</td>'
                    + '<td><a href="#" onclick="deleteStock(' + stock.id + ')"/a>Remover</td>'
                    + '</tr';
                table.append(record);
            });
        }
        loader.hide();
    };

    onErrorLoadStocks = (err, loader) => {
        console.log(err);
        loader.hide();
    }

    const loader = new bootstrap.Modal(document.getElementById('loaderModal'), { keyboard: false });
    loader.show();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:5000/stock/',
        success: data => onSuccessLoadStocks(data, loader),
        error: err => onErrorLoadStocks(err, loader),
        dataType: 'json',
        contentType: 'application/json'
    });
}