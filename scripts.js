function newColumn(content, table)
{
    let t = document.createElement("td");
    t.appendChild(content);
    table.appendChild(t);
}

function renderStock(stock) // Add stock to stock info table
{
    let newStock = document.createElement("tr");
    newStock.className = "stock-info";

    newColumn(stock.stockName, newStock);
    newColumn(stock.unitPrice, newStock);
    newColumn(stock.quantity, newStock);
    newColumn(stock.stockPrice, newStock);

    document.querySelector(".stocks > tbody").append(newStock);
}
/*
<tr class="stock-info">
    <td class="remove-stock">-</td>
</tr>
*/

class Stock
{
    constructor()
    {
        this.stockName = document.createElement("input");
        this.stockName.type = "text";
        this.stockName.placeholder = "Stock";
        this.stockName.className = "stock-name";

        this.unitPrice = document.createElement("input");
        this.unitPrice.type = "number";
        this.unitPrice.placeholder = "0";
        this.unitPrice.className = "unit-price";

        this.quantity = document.createElement("input");
        this.quantity.type = "number";
        this.quantity.placeholder = "0";
        this.quantity.className = "quantity";

        this.stockPrice = document.createElement("span");
        this.stockPrice.textContent = "0.0";
    }
}

var stocks = [];

function newStock()
{
    let stock = new Stock();
    stocks.push(stock);

    renderStock(stock);
}

document.querySelector(".add-stock-btn").addEventListener("click", newStock);
newStock(); // Initialize first stock
