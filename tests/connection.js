/*global describe, it, beforeEach */
'use strict';
var expect = require('chai').expect;
var BluePay = require('../');

describe('BlueBay', function () {
    describe('factory', function () {
        it('throws errors if AccountId or SecretKey are not set', function () {
            expect(BluePay.connect).to.throw(Error);
        });

    });
});
describe('connection', function () {
    var conn;
    beforeEach(function () {
        conn = BluePay.connect({
            accountId: 'ACCOUNT_ID',
            secretKey: 'SECRET_KEY',
            mode: 'TEST'
        });
    });
    describe('#auth()', function () {
        it('Sets the amount and the transaction type', function () {
            conn.auth('3.00');

            expect(conn.transaction.amount).to.equal('3.00');
            expect(conn.transaction.type).to.equal('AUTH');

        });
    });
});
