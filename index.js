'use strict';
var _ = require('lodash');
var Q = require('q');
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

    tranction: {
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
        doRebill: 'REBILLING',
        startDate: 'REB_FIRST_DATE',
        nextDate: '',
        expression: 'REB_EXPR',
        cycles: 'REB_CYCLES',
        amount: 'REB_AMOUNT',
        nextAmount: '',
        status: 'STATUS',
        templateId: 'TEMPLATE_ID'
    },

    response: {
        transID: 'RRNO',
        maskedAccount: 'PAYMENT_ACCOUNT',
        cardType: 'CARD_TYPE',
        customerBank: 'BANK_NAME'
    }
};

/**
 * @class Connection
 */
var Connection = {
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
        this.transaciton.type = 'CAPTURE';

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
    reset: function (keys) {
        if (arguments.length) {
            keys = Array.prototype.slice.call(arguments, 0);
        } else {
            keys = Object.keys(exemplar);
        }
        keys.forEach(function (key) {
            this[key] = {};
        });

        return this;
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
        var connection =  Object.create(Connection, {
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

    transacitons: {
        AUTH: 'AUTH',
        SALE: 'SALE',
        CAPTURE: 'CAPTURE',
        REFUND: 'REFUND',
        REBCANCEL: 'REBCANCEL'
    }
};

module.exports = factory;

