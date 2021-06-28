# Stock Price Checker

> FreeCodeCamp Stock Price Checker challenge.

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://badges.mit-license.org)
[![Build Status](https://travis-ci.com/alasdairmoffat/Stock-Price-Checker.svg?branch=master)](https://travis-ci.com/alasdairmoffat/Stock-Price-Checker)
[![codecov](https://codecov.io/gh/alasdairmoffat/Stock-Price-Checker/branch/master/graph/badge.svg)](https://codecov.io/gh/alasdairmoffat/Stock-Price-Checker)

![Demo Image](../assets/demo-image.png?raw=true)

## Table of Contents

- [Preview](#preview)
- [General Info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [License](#license)

## Preview

[Glitch](https://alasdairmoffat-stock-price-checker.glitch.me)

## General Info

Project built to fulfill the following User Stories:

1. Set the content security policies to only allow loading of scripts and css from your server.
2. I can **GET** `/api/stock-prices` with form data containing a Nasdaq _stock_ ticker and recieve back an object _stockData_.
3. In _stockData_, I can see the _stock_ (string, the ticker), _price_ (decimal in string format), and _likes_ (int).
4. I can also pass along field _like_ as **true**(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
5. If I pass along 2 stocks, the return object will be an array with both stock's info but instead of _likes_, it will display _rel_likes_ (the difference between the likes on both) on both.
6. A good way to receive current price is the following external API (replacing 'GOOG' with your stock): `https://finance.google.com/finance/info?q=NASDAQ%3aGOOG`
7. All 5 functional tests are complete and passing.

### Example usage

- /api/stock-prices?stock=goog
- /api/stock-prices?stock=goog&like=true
- /api/stock-prices?stock=goog&stock=msft
- /api/stock-prices?stock=goog&stock=msft&like=true

### Example returns

```json
{
  "stockData": { "stock": "GOOG", "price": "786.90", "likes": 1, }
}

{
  "stockData": [
    { "stock" :"MSFT", "price": "62.30", "rel_likes": -1 },
    { "stock": "GOOG", "price": "786.90", "rel_likes": 1 }
  ]
}
```

## Technologies

- Node.js version: 10.15
- Express version: 4.17
- Chai version: 4.2
- Mocha version: 6.2
- Helmet version: 3.20
- MongoDB version: 3.3
- Mongoose version: 5.6

## Setup

### Clone

Clone from repository

```bash
git clone https://github.com/alasdairmoffat/Stock-Price-Checker.git
```

### Installation

```bash
cd Stock-Price-Checker
npm install
npm start
```

## License

> **[MIT license](https://opensource.org/licenses/mit-license.php)**
