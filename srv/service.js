// srv/service.js
const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    const { Books, Orders } = this.entities;

    // ---------------------------------------------------
    // ACTION : RESET STOCK (Admin only)
    // ---------------------------------------------------
    this.on('resetStock', async (req) => {

        const stockValue = req.data.stock || 100;

        await UPDATE(Books).set({
            stock: stockValue
        });

        return `All books stock reset to ${stockValue}`;
    });

    // ---------------------------------------------------
    // ACTION : PLACE ORDER (Customer only)
    // ---------------------------------------------------
    this.on('placeOrder', async (req) => {

        const { bookID, qty } = req.data;

        if (!bookID || !qty) {
            return req.error(400, 'bookID and qty are required');
        }

        const book = await SELECT.one.from(Books).where({ ID: bookID });

        if (!book) {
            return req.error(404, 'Book not found');
        }

        if (book.stock < qty) {
            return req.error(400, 'Insufficient stock');
        }

        const total = book.price * qty;

        await INSERT.into(Orders).entries({
            book_ID: bookID,
            quantity: qty,
            totalAmount: total
        });

        await UPDATE(Books)
            .set({ stock: book.stock - qty })
            .where({ ID: bookID });

        return `Order placed successfully for ${qty} book(s)`;
    });

});