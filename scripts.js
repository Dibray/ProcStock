const precision = 4; // Fractional digits

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
        stock.stockPrice.textContent = (stock.unitPrice.value * stock.quantity.value).toFixed(precision);
        StockProcessing.procTotal();
    }

    #isEnter(key)
    {
        if (key == "Enter")
            return true;
        
        return false;
    }
}

class Promocode
{
    code = null;
    discountPercent = null;

    constructor(code, percent)
    {
        this.code = code;
        this.discountPercent = percent;
    }
}

class StockProcessing
{
    static #stocks = [];
    static #promocodes = [new Promocode("dis10", 0.1), new Promocode("dis20", 0.2), new Promocode("dis30", 0.3)];

    static #vatPercent = 0.09;

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

    static #promocodeDiscountInfo(total, discount) // Render promocode discount info
    {
        let info = document.querySelector(".promocode-discount-info");

        if (info !== null)
            info.remove();

        if (discount == 0)
            return;
            
        info = document.createElement("p");
        info.className = "promocode-discount-info";
        info.textContent =
            "Promocode discount " + (discount * 100) + "% (-" + (total * discount).toFixed(precision) + ")";

        document.querySelector(".promocode-form").appendChild(info);
    }
    
    static #promocodeDiscount()
    {
        let promocode = document.querySelector(".promocode-field").value;

        for (const x of this.#promocodes)
            if (x.code == promocode)
                return x.discountPercent;
        
        return 0; // No promocode - no discount
    }

    static procTotal()
    {
        let total = this.#procTotalPrice();

        document.querySelector(".price-value").textContent = total.toFixed(precision);

        // Process VAT
        let vat = total * this.#vatPercent;
        document.querySelector(".vat-value").textContent = vat.toFixed(precision);
        total += vat;

        // Process promocode
        let promocodeDiscount = this.#promocodeDiscount();
        this.#promocodeDiscountInfo(total, promocodeDiscount);
        
        total = total * (1 - promocodeDiscount);

        document.querySelector(".total-value").textContent = total.toFixed(precision);
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

document.querySelector(".promocode-submit").addEventListener("click", () => { StockProcessing.procTotal(); });
