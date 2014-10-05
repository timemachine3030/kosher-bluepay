#Index

**Classes**

* [class: Connection](#Connection)
  * [Connection.auth(amount, masterId)](#Connection.auth)
  * [Connection.capture(masterId, amount)](#Connection.capture)
  * [Connection.refund(masterId, amount)](#Connection.refund)
  * [Connection.sale(amount, masterId)](#Connection.sale)
  * [Connection.void(masterId)](#Connection.void)
  * [Connection.setCustomerInformation(customer)](#Connection.setCustomerInformation)
  * [Connection.setCardInformation(card, expire,, cvv2)](#Connection.setCardInformation)
  * [Connection.setAchInformation(routingNumber, accountNumber, accountType, documentType)](#Connection.setAchInformation)
  * [Connection.setRebillingInformation(start, expression, cycles, amount)](#Connection.setRebillingInformation)
  * [Connection.reset(...keys)](#Connection.reset)

**Members**

* [exemplar](#exemplar)
* [accountId](#accountId)
* [mode](#mode)
* [secretKey](#secretKey)
 
<a name="Connection"></a>
#class: Connection
**Members**

* [class: Connection](#Connection)
  * [Connection.auth(amount, masterId)](#Connection.auth)
  * [Connection.capture(masterId, amount)](#Connection.capture)
  * [Connection.refund(masterId, amount)](#Connection.refund)
  * [Connection.sale(amount, masterId)](#Connection.sale)
  * [Connection.void(masterId)](#Connection.void)
  * [Connection.setCustomerInformation(customer)](#Connection.setCustomerInformation)
  * [Connection.setCardInformation(card, expire,, cvv2)](#Connection.setCardInformation)
  * [Connection.setAchInformation(routingNumber, accountNumber, accountType, documentType)](#Connection.setAchInformation)
  * [Connection.setRebillingInformation(start, expression, cycles, amount)](#Connection.setRebillingInformation)
  * [Connection.reset(...keys)](#Connection.reset)

<a name="Connection.auth"></a>
##Connection.auth(amount, masterId)
Creates an AUTH transaction

**Params**

- amount `Float`  
- masterId `String`  

**Returns**: [Connection](#Connection)  
<a name="Connection.capture"></a>
##Connection.capture(masterId, amount)
Creates a CAPTURE transaction

**Params**

- masterId `String`  
- amount `Float`  

**Returns**: [Connection](#Connection)  
<a name="Connection.refund"></a>
##Connection.refund(masterId, amount)
Creates a REFUND transaction

**Params**

- masterId `String`  
- amount `Float`  

**Returns**: [Connection](#Connection)  
<a name="Connection.sale"></a>
##Connection.sale(amount, masterId)
Creates a SALE transaction

**Params**

- amount `Float`  
- masterId `String`  

**Returns**: [Connection](#Connection)  
<a name="Connection.void"></a>
##Connection.void(masterId)
VOID a transaction

**Params**

- masterId `String`  

**Returns**: [Connection](#Connection)  
<a name="Connection.setCustomerInformation"></a>
##Connection.setCustomerInformation(customer)
Populates customer information for the transaction. The customer 
object may contain: 

customer: {
    name1
    name2
    addr1
    addr2
    city
    state
    zip
    email
    phone
    country
}

**Params**

- customer `Object`  

**Returns**: [Connection](#Connection)  
<a name="Connection.setCardInformation"></a>
##Connection.setCardInformation(card, expire,, cvv2)
Populates the credit card information and also the payment type of the
transaction.

**Params**

- card `String`  
- expire, `Mixed` - Must be a 4 digit number or string in the 
format MMYY, or a Date object.  
- cvv2 `String`  

**Returns**: [Connection](#Connection)  
<a name="Connection.setAchInformation"></a>
##Connection.setAchInformation(routingNumber, accountNumber, accountType, documentType)
Populated the ACH information and also the payment type of the
transaction.

**Params**

- routingNumber `String`  
- accountNumber `String`  
- accountType `String`  
- documentType `String`  

**Returns**: [Connection](#Connection)  
<a name="Connection.setRebillingInformation"></a>
##Connection.setRebillingInformation(start, expression, cycles, amount)
Creates a rebilling cycle

**Params**

- start `Date`  
- expression `String`  
- cycles `Number`  
- amount `Float`  

**Returns**: [Connection](#Connection)  
<a name="Connection.reset"></a>
##Connection.reset(...keys)
Clears the properties, provided in the `keys` array, from the 
connection. If no argument is passed clears all properties 
enumerated in the exemplar.

**Params**

- ...keys `String`  

**Returns**: [Connection](#Connection)  
<a name="exemplar"></a>
#exemplar
The exemplars are models of the BluePay paremeters we will 
loop through to build API requests. The value of each member 
is its required status.

<a name="accountId"></a>
#accountId
BluePay account id

<a name="mode"></a>
#mode
BluePay transaction Mode, can be TEST or LIVE.  Defaults to TEST.

<a name="secretKey"></a>
#secretKey
BluePay account secret

