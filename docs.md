#Index

**Classes**

* [class: BluePay](#BluePay)
  * [BluePay.auth(amount, masterId)](#BluePay.auth)
  * [BluePay.capture(masterId, amount)](#BluePay.capture)
  * [BluePay.refund(masterId, amount)](#BluePay.refund)
  * [BluePay.sale(amount, masterId)](#BluePay.sale)
  * [BluePay.void(masterId)](#BluePay.void)
  * [BluePay.setCustomerInformation(customer)](#BluePay.setCustomerInformation)
  * [BluePay.setCardInformation(card, expire,, cvv2)](#BluePay.setCardInformation)
  * [BluePay.setAchInformation(routingNumber, accountNumber, accountType, documentType)](#BluePay.setAchInformation)
  * [BluePay.setRebillingInformation(start, expression, cycles, amount)](#BluePay.setRebillingInformation)
  * [BluePay.reset(...keys)](#BluePay.reset)
  * [BluePay.updateRebillingCycle(id,, next,, expression, cycles,, amount,)](#BluePay.updateRebillingCycle)
  * [BluePay.setRebillingTemplate(id,)](#BluePay.setRebillingTemplate)
  * [BluePay.cancelRebilling(id,)](#BluePay.cancelRebilling)
  * [BluePay.getRebillingStatus(id,)](#BluePay.getRebillingStatus)
  * [BluePay.process()](#BluePay.process)
  * [BluePay.seal(parameters)](#BluePay.seal)

**Members**

* [exemplar](#exemplar)
* [accountId](#accountId)
* [mode](#mode)
* [secretKey](#secretKey)
 
<a name="BluePay"></a>
#class: BluePay
**Members**

* [class: BluePay](#BluePay)
  * [BluePay.auth(amount, masterId)](#BluePay.auth)
  * [BluePay.capture(masterId, amount)](#BluePay.capture)
  * [BluePay.refund(masterId, amount)](#BluePay.refund)
  * [BluePay.sale(amount, masterId)](#BluePay.sale)
  * [BluePay.void(masterId)](#BluePay.void)
  * [BluePay.setCustomerInformation(customer)](#BluePay.setCustomerInformation)
  * [BluePay.setCardInformation(card, expire,, cvv2)](#BluePay.setCardInformation)
  * [BluePay.setAchInformation(routingNumber, accountNumber, accountType, documentType)](#BluePay.setAchInformation)
  * [BluePay.setRebillingInformation(start, expression, cycles, amount)](#BluePay.setRebillingInformation)
  * [BluePay.reset(...keys)](#BluePay.reset)
  * [BluePay.updateRebillingCycle(id,, next,, expression, cycles,, amount,)](#BluePay.updateRebillingCycle)
  * [BluePay.setRebillingTemplate(id,)](#BluePay.setRebillingTemplate)
  * [BluePay.cancelRebilling(id,)](#BluePay.cancelRebilling)
  * [BluePay.getRebillingStatus(id,)](#BluePay.getRebillingStatus)
  * [BluePay.process()](#BluePay.process)
  * [BluePay.seal(parameters)](#BluePay.seal)

<a name="BluePay.auth"></a>
##BluePay.auth(amount, masterId)
Creates an AUTH transaction

**Params**

- amount `Float`  
- masterId `String`  

**Returns**: `Connection`  
<a name="BluePay.capture"></a>
##BluePay.capture(masterId, amount)
Creates a CAPTURE transaction

**Params**

- masterId `String`  
- amount `Float`  

**Returns**: `Connection`  
<a name="BluePay.refund"></a>
##BluePay.refund(masterId, amount)
Creates a REFUND transaction

**Params**

- masterId `String`  
- amount `Float`  

**Returns**: `Connection`  
<a name="BluePay.sale"></a>
##BluePay.sale(amount, masterId)
Creates a SALE transaction

**Params**

- amount `Float`  
- masterId `String`  

**Returns**: `Connection`  
<a name="BluePay.void"></a>
##BluePay.void(masterId)
VOID a transaction

**Params**

- masterId `String`  

**Returns**: `Connection`  
<a name="BluePay.setCustomerInformation"></a>
##BluePay.setCustomerInformation(customer)
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

**Returns**: `Connection`  
<a name="BluePay.setCardInformation"></a>
##BluePay.setCardInformation(card, expire,, cvv2)
Populates the credit card information and also the payment type of the
transaction.

**Params**

- card `String`  
- expire, `Mixed` - Must be a 4 digit number or string in the format MMYY, or a Date object.  
- cvv2 `String`  

**Returns**: `Connection`  
<a name="BluePay.setAchInformation"></a>
##BluePay.setAchInformation(routingNumber, accountNumber, accountType, documentType)
Populated the ACH information and also the payment type of the
transaction.

**Params**

- routingNumber `String`  
- accountNumber `String`  
- accountType `String`  
- documentType `String`  

**Returns**: `Connection`  
<a name="BluePay.setRebillingInformation"></a>
##BluePay.setRebillingInformation(start, expression, cycles, amount)
Creates a rebilling cycle

**Params**

- start `Date`  
- expression `String`  
- cycles `Number`  
- amount `Float`  

**Returns**: `Connection`  
<a name="BluePay.reset"></a>
##BluePay.reset(...keys)
Clears the properties, provided in the `keys` array, from the 
connection. If no argument is passed clears all properties 
enumerated in the exemplar.

**Params**

- ...keys `String`  

**Returns**: `Connection`  
<a name="BluePay.updateRebillingCycle"></a>
##BluePay.updateRebillingCycle(id,, next,, expression, cycles,, amount,)
Updates the Transaction type and adjusts the rebilling parameters

**Params**

- id, `String` - The 12-digit ID of the Rebilling to modify/view  
- next, `Date` - Set the next rebill date to this date  
- expression `String`  
- cycles, `Number` - Number of billings to complete.  
- amount, `Float` - Amount to charge for the each billing  

**Returns**: `Connection`  
<a name="BluePay.setRebillingTemplate"></a>
##BluePay.setRebillingTemplate(id,)
Sets the rebilling template.

**Params**

- id, `String` - The 12-digit ID of the template for this rebilling.  

**Returns**: `Connection`  
<a name="BluePay.cancelRebilling"></a>
##BluePay.cancelRebilling(id,)
Cancel a rebilling

**Params**

- id, `String` - The 12-digit ID specifying this rebilling.  

**Returns**: `Connection`  
<a name="BluePay.getRebillingStatus"></a>
##BluePay.getRebillingStatus(id,)
Get the current status of a rebilling

**Params**

- id, `String` - The 12-digit ID specifying this rebilling.  

**Returns**: `Connection`  
<a name="BluePay.process"></a>
##BluePay.process()
Process the transaction on the current connection.

<a name="BluePay.seal"></a>
##BluePay.seal(parameters)
Creates a tamper proof seal for the message

**Params**

- parameters `Object`  

**Returns**: `String`  
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

