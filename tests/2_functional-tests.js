/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

/* global suite test suiteTeardown */

const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suiteTeardown(async () => {
    server.stop();
  });

  suite('GET /api/stock-prices => stockData object', () => {
    let numLikes1;

    test('1 stock', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end((err, res) => {
          // complete this one too
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stock',
            'Response should contain the stock ticker.',
          );
          assert.property(
            res.body,
            'price',
            'Response should contain the price.',
          );
          assert.property(
            res.body,
            'likes',
            'Response should contain the number of likes.',
          );
          assert.equal(
            res.body.stock,
            'GOOG',
            'Response stock name should match.',
          );
          assert.isNumber(res.body.price, 'Stock price should be a number.');
          assert.isNumber(
            res.body.likes,
            'Number of likes should be a number.',
          );

          numLikes1 = res.body.likes;
          done();
        });
    });

    test('1 stock with like', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stock',
            'Response should contain the stock ticker.',
          );
          assert.property(
            res.body,
            'price',
            'Response should contain the price.',
          );
          assert.property(
            res.body,
            'likes',
            'Response should contain the number of likes.',
          );
          assert.equal(
            res.body.stock,
            'GOOG',
            'Response stock name should match.',
          );
          assert.isNumber(res.body.price, 'Stock price should be a number.');
          assert.oneOf(
            res.body.likes,
            [numLikes1 + 1, numLikes1],
            'Number of likes should be incremented or the same.',
          );

          numLikes1 = res.body.likes;
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stock',
            'Response should contain the stock ticker.',
          );
          assert.property(
            res.body,
            'price',
            'Response should contain the price.',
          );
          assert.property(
            res.body,
            'likes',
            'Response should contain the number of likes.',
          );
          assert.equal(
            res.body.stock,
            'GOOG',
            'Response stock name should match.',
          );
          assert.isNumber(res.body.price, 'Stock price should be a number.');
          assert.equal(
            res.body.likes,
            numLikes1,
            'Number of likes should not be incremented.',
          );
          done();
        });
    });

    const stock = ['AAPL', 'MSFT'];
    const numLikes2 = [];

    test('2 stocks', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(
            res.body.stockData,
            'Response stockData should be an array.',
          );
          assert.equal(
            res.body.stockData.length,
            2,
            'Response stockData should be length 2.',
          );

          res.body.stockData.forEach((data, i) => {
            assert.property(
              data,
              'stock',
              'Response should contain the stock ticker.',
            );
            assert.property(
              data,
              'price',
              'Response should contain the price.',
            );
            assert.property(
              data,
              'rel_likes',
              'Response should contain the number of likes.',
            );
            assert.equal(
              data.stock,
              stock[i],
              'Response stock name should match.',
            );
            assert.isNumber(data.price, 'Stock price should be a number.');
            assert.isNumber(
              data.rel_likes,
              'Number of rel_likes should be a number.',
            );

            numLikes2[i] = data.rel_likes;
          });
          done();
        });
    });

    test('2 stocks with like', (done) => {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock, like: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(
            res.body.stockData,
            'Response stockData should be an array.',
          );
          assert.equal(
            res.body.stockData.length,
            2,
            'Response stockData should be length 2.',
          );

          res.body.stockData.forEach((data, i) => {
            assert.property(
              data,
              'stock',
              'Response should contain the stock ticker.',
            );
            assert.property(data, 'price', 'Response should contain the price.');
            assert.property(
              data,
              'rel_likes',
              'Response should contain the number of likes.',
            );
            assert.equal(
              data.stock,
              stock[i],
              'Response stock name should match.',
            );
            assert.equal(
              data.rel_likes,
              numLikes2[i],
              'Number of rel_likes should be unchanged.',
            );
          });
          done();
        });
    });
  });
});
