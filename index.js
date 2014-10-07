'use strict';
var _ = require('lodash');
var crypto = require('crypto');
var Q = require('q');
var querystring = require('querystring');
var request = require('request');

/**
 * The exemplars are models of the BluePay paremeters we will 
 * loop through to build API requests. The value of each member 
 * is its required status.
 */
var exemplar = {
    customer: {
        name1: 'NAME1',
        name2: 'NAME2',
        company: 'COMPANY_NAME',
        addr1: 'ADDR1',
        addr2: 'ADDR2',
        city: 'CITY',
        state: 'STATE',
        zip: 'ZIPCODE',
        email: 'EMAIL',
        phone: 'PHONE',
        country: 'COUNTRY',
        remoteIp: 'REMOTE_IP'
    },

    card: {
        account: 'CC_NUM',
        cardExpire: 'CC_EXPIRES',
        cvv2: 'CVCCVV2'
    },

    ach: {
        accountType: 'ACH_ACCOUNT_TYPE',
        docType: 'DOC_TYPE',
        accountNum: 'ACH_ACCOUNT',
        routingNum: 'ACH_ROUTING'
    },

    transaction: {
        amount: 'AMOUNT',
        paymentType: 'PAYMENT_TYPE',
        type: 'TRANSACTION_TYPE',
        masterId: 'RRNO',
        memo: 'COMMENT',
        corporate: 'IS_CORPORATE',
        customId1: 'CUSTOM_ID',
        customId2: 'CUSTOM_ID2',
        invoiceId: 'INVOICE_ID',
        orderId: 'ORDER_ID',
        amountTip: 'AMOUNT_TIP',
        amountTax: 'AMOUNT_TAX',
        amountFood: 'AMOUNT_FOOD',
        amountMisc: 'AMOUNT_MISC',
        dupeOverride: 'DUPLICATE_OVERRIDE'
    },

    rebilling: {
        id: 'REBILL_ID',
        doRebill: 'REBILLING',
        startDate: 'REB_FIRST_DATE',
        nextDate: 'NEXT_DATE',
        expression: 'REB_EXPR',
        cycles: 'REB_CYCLES',
        amount: 'REB_AMOUNT',
        nextAmount: '',
        status: 'STATUS',
        templateId: 'TEMPLATE_ID'
    },

    response: {
        transId: 'RRNO',
        maskedAccount: 'PAYMENT_ACCOUNT',
        cardType: 'CARD_TYPE',
        customerBank: 'BANK_NAME',
        message: 'MESSAGE',
        status: 'Result',
        rebillId: 'rebill_id',
        templateId: 'template_id',
        masterId: 'id',
        paymentType: 'payment_type',
        type: 'trans_type',
        amount: 'amount'
    }
};

/**
 * @class BluePay
 */
//function BluePay () {}
var BluePay = {
    /**
     * Creates an AUTH transaction
     *
     * @param {Float} amount
     * @param {String} masterId
     * @return {Connection}
     */
    auth: function (amount, masterId) {
        this.transaction.amount = amount || 0;
        this.transaction.masterId = masterId;
        this.transaction.type = 'AUTH';

        return this;
    },

    /**
     * Creates a CAPTURE transaction
     *
     * @param {String} masterId
     * @param {Float} amount
     * @return {Connection}
     */
    capture: function (masterId, amount) {
        this.transaction.amount = amount;
        this.transaction.masterId = masterId;
        this.transaction.type = 'CAPTURE';

        return this;
    },

    /**
     * Creates a REFUND transaction
     *
     * @param {String} masterId
     * @param {Float} amount
     * @return {Connection}
     */
    refund: function (masterId, amount) {
        this.transaction.amount = amount;
        this.transaction.masterId = masterId;
        this.transaction.type = 'CAPTURE';

        return this;
    },

    /**
     * Creates a SALE transaction
     *
     * @param {Float} amount
     * @param {String} masterId
     * @return {Connection}
     */
    sale: function (amount, masterId) {
        this.transaction.amount = amount;
        this.transaction.masterId = masterId;
        this.transaction.type = 'SALE';

        return this;
    },

    /**
     * VOID a transaction
     *
     * @param {String} masterId
     * @return {Connection}
     */
    void: function (masterId) {
        this.transaction.masterId = masterId;
        this.transaction.type = 'VOID';

        return this;
    },

    /**
     * Populates customer information for the transaction. The customer 
     * object may contain: 
     *
     * customer: {
     *     name1
     *     name2
     *     addr1
     *     addr2
     *     city
     *     state
     *     zip
     *     email
     *     phone
     *     country
     * }
     *
     * @param {Object} customer
     * @returns {Connection}
     */
    setCustomerInformation: function (customer) {
        this.customer = customer;

        return this;
    },

    /**
     * Populates the credit card information and also the payment type of the
     * transaction.
     *
     * @param {String} card
     * @param {Mixed} expire, Must be a 4 digit number or string in the format MMYY, or a Date object.
     * @param {String} cvv2
     * @return {Connection}
     */
    setCardInformation: function (card, expire, cvv2) {
        var month;
        var year;
        if (_.isDate(expire)) {
            month = expire.getMonth() + 1; // getMonth returns value 0-11
            year = expire.getFullYear().toString().substr(2, 2);
            expire = month + year;
        }

        this.creditcard.account = card;
        this.creditcard.expire = expire;
        this.creditcard.cvv2 = cvv2 || '';
        this.transaction.paymentType = 'CREDIT';

        return this;
    },

    /** Populated the ACH information and also the payment type of the
     * transaction.
     *
     * @param {String} routingNumber
     * @param {String} accountNumber
     * @param {String} accountType
     * @param {String} documentType
     * @return {Connection}
     */
    setAchInformation: function (routingNumber, accountNumber, accountType, documentType) {
        this.ach.routingNum = routingNumber;
        this.ach.accountNum = accountNumber;
        this.ach.accountType = accountType;
        this.ach.docType = documentType || '';
        this.transaction.paymentType = 'ACH';

        return this;
    },

    /**
     * Creates a rebilling cycle
     *
     * @param {Date} start
     * @param {String} expression
     * @param {Number} cycles
     * @param {Float} amount
     * @return {Connection}
     */
    setRebillingInformation: function (start, expression, cycles, amount) {
        this.rebilling.doRebill = 1;
        this.rebilling.startDate = start;
        this.rebilling.expression = expression;
        this.rebilling.cycles = cycles;
        this.rebilling.amount = amount;

        return this;
    },

    /**
     * Clears the properties, provided in the `keys` array, from the 
     * connection. If no argument is passed clears all properties 
     * enumerated in the exemplar.
     *
     * @param {...String} keys
     * @return {Connection}
     */
    reset: function () {
        var keys;
        if (arguments.length) {
            keys = Array.prototype.slice.call(arguments, 0);
        } else {
            keys = Object.keys(exemplar);
        }
        keys.forEach(function (key) {
            this[key] = {};
        }.bind(this));

        return this;
    },

    /**
     * Updates the Transaction type and adjusts the rebilling parameters
     *
     * @param {String} id, The 12-digit ID of the Rebilling to modify/view
     * @param {Date} next, Set the next rebill date to this date
     * @param {String} expression
     * @param {Number} cycles, Number of billings to complete.
     * @param {Float} amount, Amount to charge for the each billing
     * @return {Connection}
     */
    updateRebillingCycle: function (id, next, expression, cycle, amount) {
        this.transaction.type = 'SET';
        this.rebilling.id = id;
        this.rebilling.nextDate = next;
        this.rebilling.expression = expression;
        this.rebilling.cycle = cycle;
        this.rebilling.amount = amount;

        return this;
    },

    /**
     * Sets the rebilling template.
     *
     * @param {String} id, The 12-digit ID of the template for this rebilling.
     * @return {Connection}
     */
    setRebillingTemplate: function (id) {
        this.rebilling.templateId = id;

        return this;
    },

    /**
     * Cancel a rebilling
     *
     * @param {String} id, The 12-digit ID specifying this rebilling.
     * @return {Connection}
     */
    cancelRebilling: function (id) {
        this.transaction.type = 'SET';
        this.rebilling.status = 'stopped';
        this.rebilling.id = id;

        return this;
    },

    /**
     * Get the current status of a rebilling
     *
     * @param {String} id, The 12-digit ID specifying this rebilling.
     * @return {Connection}
     */
    getRebillingStatus: function (id) {
        this.transaction.type = 'GET';
        this.rebilling.id = id;

        return this;
    },

    /**
     * Process the transaction on the current connection.
     *
     */
    process: function () {
        var deferred = Q.defer();
        var parameters = {};
        var self = this;
        var url = 'https://secure.bluepay.com/interfaces/bp10emu';
        function copyConfig(item) {
            self[item].forEach(function (key) {
                parameters[exemplar[item][key]] = self[item][key];
            });

        }

        parameters.mode = this.mode;

        if (this.transaction.type === 'SET' && this.transaction.type === 'GET') {
            copyConfig('transaction');
            copyConfig('customer');

            if (this.transaction.paymentType === 'CREDIT') {
                copyConfig('credit');
            } else {
                copyConfig('ach');
            }

            if (this.rebilling.doRebill) {
                copyConfig('rebilling');
            }
            parameters.TAMPER_PROOF_SEAL = this.seal(parameters);
            url = 'https://secure.bluepay.com/interfaces/bp10emu';
        } else {
            parameters.ACCOUNT_ID = this.accountId;
            copyConfig('transaction');
            copyConfig('rebilling');
            parameters.TAMPER_PROOF_SEAL = this.seal(parameters);
            url = 'https://secure.bluepay.com/interfaces/bp20rebadmin';
        }

        request.post(url, parameters, function (err, response, body) {
            var result;
            if (err) {
                return deferred.reject(err);
            }
            result = querystring.parse(body);
            exemplar.response.forEach(function (key) {
                self.response[exemplar.response[key]] = result[key];
            });

            deferred.resolve(self.response);
        });

        return deferred.promise;
    },

    /**
     * Creates a tamper proof seal for the message
     *
     * @param {Object} parameters
     * @return {String}
     */
    seal: function (parameters) {
      var md5 = crypto.createHash('md5');
      md5.update(parameters.SECRET_KEY);
      md5.update(parameters.ACCOUNT_ID);
      md5.update(parameters.TRANS_TYPE);
      md5.update(parameters.AMOUNT);
      md5.update(parameters.MASTER_ID || '');
      md5.update(parameters.NAME1 || '');
      md5.update(parameters.PAYMENT_ACCOUNT);
      return md5.digest('hex');
    }
};

var factory = {
    /**
     * Connection factory
     *
     * @param {Object} options
     * @return {Connection}
     */
    connect: function (options) {
        if (!options.hasOwnProperty('accountId') || !options.hasOwnProperty('secretKey')) {
            throw new Error('Must define AccountId and SecretKey when creating a new BluePay connection');
        }
        var connection =  Object.create(BluePay, {
            /**
             * BluePay account id
             */
            accountId: {
                value: options.accountId,
                writable: false
            },

            /**
             * BluePay transaction Mode, can be TEST or LIVE.  Defaults to TEST.
             */
            mode: {
                value: options.mode || 'TEST',
                writable: true
            },

            /**
             * BluePay account secret
             */
            secretKey: {
                value: options.secretKey,
                writable: false
            }
        });


        connection.reset();
        return connection;
    },

    modes: {
        TEST: 'TEST',
        LIVE: 'LIVE'
    },

    payments: {
        CREDIT: 'CREDIT',
        ACH: 'ACH',
    },

    transactions: {
        AUTH: 'AUTH',
        SALE: 'SALE',
        CAPTURE: 'CAPTURE',
        REFUND: 'REFUND',
        REBCANCEL: 'REBCANCEL'
    },
    status: {
        APPROVED: '1',
        DECLINED: '0'
    }
};

module.exports = factory;

