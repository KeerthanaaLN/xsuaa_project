namespace my.bookshop;

using { managed } from '@sap/cds/common';

entity Books : managed {
    key ID      : UUID;
    title       : String(100);
    author      : String(100);
    price       : Decimal(9,2);
    stock       : Integer;
}

entity Orders : managed {
    key ID      : UUID;
    book        : Association to Books;
    quantity    : Integer;
    totalAmount : Decimal(9,2);
}