class Stock
{    
    stockName = document.createElement("input");
    unitPrice = document.createElement("input");
    quantity = document.createElement("input");
    stockPrice = document.createElement("span");
    remove = document.createElement("button");

    constructor()
    {
        this.stockName.type = "text";
        this.stockName.placeholder = "Stock";
        this.stockName.className = "stock-name";

        this.unitPrice.type = "number";
        this.unitPrice.placeholder = "0";
        this.unitPrice.className = "unit-price";
        this.unitPrice.addEventListener("click", () => { this.#calcPrice(this); });
        this.unitPrice.addEventListener("keypress", () => { if(this.#isEnter(event.key)) this.#calcPrice(this); });
        
        this.quantity.type = "number";
        this.quantity.placeholder = "0";
        this.quantity.className = "quantity";
        this.quantity.addEventListener("click", () => { this.#calcPrice(this); });
        this.quantity.addEventListener("keypress", () => { if (this.#isEnter(event.key)) this.#calcPrice(this); });

        this.stockPrice.textContent = 0.0;

        this.remove.textContent = "–";
        this.remove.className = "remove-btn";
    }

    #calcPrice(stock)
    {
        stock.stockPrice.textContent = stock.unitPrice.value * stock.quantity.value;
        StockProcessing.procTotal();
    }

    #isEnter(key)
    {
        if (key == "Enter")
            return true;
        
        return false;
    }
}

class StockProcessing
{
    static #stocks = [];
    static #vatPercent = 0.09;
    static #precision = 4; // Fractional digits

    static #procTotalPrice()
    {
        let price = 0.0;

        for (const x of this.#stocks)
            price += Number(x.stockPrice.textContent);

        return price;
    }

    static #newColumn(content, table)
    {
        let t = document.createElement("td");
        t.appendChild(content);
        table.appendChild(t);
    }

    static #remove(stock, domElem) // Delete stock from array and DOM
    {
        this.#stocks.splice(this.#stocks.indexOf(stock), 1);
        domElem.remove();
        this.procTotal();
    }

    static #renderStock(stock) // Add stock to stock info table
    {
        let newStock = document.createElement("tr");
        newStock.className = "stock-info";

        this.#newColumn(stock.stockName, newStock);
        this.#newColumn(stock.unitPrice, newStock);
        this.#newColumn(stock.quantity, newStock);
        this.#newColumn(stock.stockPrice, newStock);
        this.#newColumn(stock.remove, newStock);

        stock.remove.addEventListener("click", () => { this.#remove(stock, newStock); });

        document.querySelector(".stocks > tbody").append(newStock);
    }

    static procTotal()
    {
        let total = this.#procTotalPrice();

        document.querySelector(".price-value").textContent = total.toFixed(this.#precision);

        // Process VAT
        let vat = total * this.#vatPercent;
        document.querySelector(".vat-value").textContent = vat.toFixed(this.#precision);

        // Process TOTAL
        total += vat;
        document.querySelector(".total-value").textContent = total.toFixed(this.#precision);
    }

    static newStock()
    {
        let stock = new Stock();
        this.#stocks.push(stock);

        this.#renderStock(stock);
    }
}

document.querySelector(".add-stock-btn").addEventListener("click", () => { StockProcessing.newStock(); });
StockProcessing.newStock(); // Initialize first stock
