Why `kosher-`? This software does its best to conform to all the holy best practices of JavaScript; including proper style, linting, and testing. It aims to be an acceptable tool as well as an exemplar for learning and instructing good style.

# Quick start

## Store Payment Information

Send the Credit Card information and returns a Transaction ID, which you can use as a token for future transactions. 

```javascript
var bluepay = require('kosher-bluepay');
var connection = bluepay.connect({
    accountId: 'ACCOUNT_ID',
    secretKey: 'SECRET_KEY',
    mode: 'TEST'
});

connection
.setCustomerInformation()
.setCCInformation()
.makeToken()
.process()
.then(function (status, transaction) {

}, function (err) {

});
```

## Charge a Customer

```javascript
// Continuing with the example above, using the same customer information.
connection
.sale('3.00')
.process()
.then(function (status, transaction) {

}, function (err) {

});
```
or reuse a transaction token
```javascript
// Clear the transaction specific data from connection
connection.reset();
// Load the transaction an complete the sale.
connection.sale('1.99', token).process();
```

## Check If a Customer Has Enough Credit Available

Determine if customer has enough credit available without charging card.

```javascript
connection.auth('1.99').process();
```

## Return Funds to a Customer

```javascript
connection.refund('1.99', token).process();
```

## Cancel a Transaction

You can cancel a transaction if it has not yet been settled. If a transaction has already been settled, then you must issue a refund instead.

This code cancels single transactions; it doesn't cancel recurring payments.

```javascript
connection.void(transactionId).process();
```
