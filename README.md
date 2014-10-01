Why `kosher-`? This software does its best to conform to all the holy best practices of JavaScript; including proper style, linting, and testing. I aims to be an acceptable tool as well as an exemplar for learning and instructing good style.

# Quick start

```javascript
var bluepay = require('kosher-bluepay');
var payment = bluepay.connect({
    accountId: 'ACCOUNT_ID',
    secretKey: 'SECRET_KEY',
    mode: 'TEST'
});

payment.setCustomerInformation();
payment.setCCInformation();
payment.auth('0.00').process().then(function (status, transaction) {
    console.log(status);
    console.log(transaction);
}, function (err) {
    console.log(err);
});
```


