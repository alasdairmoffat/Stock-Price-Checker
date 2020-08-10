/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log('MongoDB connected'))
  .catch(err => console.log(err));

const { Schema } = mongoose;

const stockSchema = new Schema({
  stock: {
    type: String,
    required: true,
  },
  likeIps: {
    type: Array,
    default: [],
  },
});

const Stock = mongoose.model('Stock', stockSchema);

const apiLimitMessage = 'API limit exceeded. Please try again later.';

async function getStockPrice(stockName) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockName}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

  try {
    const stockPrice = await axios.get(url);
    if (stockPrice.data['Global Quote']) {
      return parseFloat(stockPrice.data['Global Quote']['05. price']);
    }
    if (stockPrice.data.Note) {
      return stockPrice.data.Note;
    }
    return undefined;
  } catch (err) {
    console.log(err.message, err.stack);
    return undefined;
  }
}

async function queryStock(stockName, like, ip) {
  const stock = stockName.toUpperCase();

  const newStock = like === 'true' ? { stock, $addToSet: { likeIps: ip } } : { stock };
  try {
    const [dbResponse, stockPrice] = await Promise.all([
      Stock.findOneAndUpdate({ stock }, newStock, {
        new: true,
        upsert: true,
      }),
      getStockPrice(stockName),
    ]);

    if (
      stockPrice
      === 'Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.'
    ) {
      throw new Error(apiLimitMessage);
    }

    return {
      stock: dbResponse.stock,
      price: stockPrice,
      likes: dbResponse.likeIps.length,
    };
  } catch (err) {
    throw err;
  }
}

module.exports = (app) => {
  app.route('/api/stock-prices').get(async (req, res) => {
    const { stock, like } = req.query;
    const ip = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0]
      : req.connection.remoteAddress;

    try {
      if (Array.isArray(stock)) {
        const responses = await Promise.all([
          queryStock(stock[0], like, ip),
          queryStock(stock[1], like, ip),
        ]);

        const stockData = responses.map((response, i) => {
          const { stock, price } = response;
          const rel_likes = response.likes - responses[(i + 1) % 2].likes;

          return { stock, price, rel_likes };
        });

        res.json({
          stockData,
        });
      } else {
        const response = await queryStock(stock, like, ip);

        res.json(response);
      }
    } catch (err) {
      if (err.message === apiLimitMessage) {
        res.status(500).json(apiLimitMessage);
      } else {
        res.status(500).json('Request failed');
      }
    }
  });
};
