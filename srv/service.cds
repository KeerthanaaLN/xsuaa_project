// srv/service.cds
using my.bookshop as db from '../db/schema';

service CatalogService @(path:'/odata/v4/catalog') {

    // ---------------- BOOKS ----------------
    // @readonly
    @restrict: [
        { grant: 'READ', to: ['Viewer','Customer','Admin'] }
    ]
    entity Books as projection on db.Books;

    // ---------------- ORDERS ----------------
    @restrict: [
        { grant: 'READ', to: ['Customer','Admin'] },
        { grant: 'CREATE', to: ['Customer','Admin'] },
        { grant: 'UPDATE', to: ['Admin'] },
        { grant: 'DELETE', to: ['Admin'] }
    ]
    entity Orders as projection on db.Orders;

    // ---------------- ACTIONS ----------------
    @requires: 'Admin'
    action resetStock(stock : Integer default 100) returns String;

    @requires: 'Customer'
    action placeOrder(bookID : UUID, qty : Integer) returns String;
}