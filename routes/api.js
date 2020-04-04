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

async function getStockPrice(stockName) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockName}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

  try {
    const stockPrice = await axios.get(url);
    return parseFloat(stockPrice.data['Global Quote']['05. price']);
  } catch (err) {
    console.log(err.message, err.stack);
  }
}

async function queryStock(stockName, like, ip) {
  const stock = stockName.toUpperCase();

  const newStock = like ? { stock, $addToSet: { likeIps: ip } } : { stock };
  try {
    const [dbResponse, stockPrice] = await Promise.all([
      Stock.findOneAndUpdate({ stock }, newStock, {
        new: true,
        upsert: true,
      }),
      getStockPrice(stockName),
    ]);

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
    const { ip } = req;

    if (Array.isArray(stock)) {
      try {
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
      } catch (err) {
        res.status(500).json('Request failed');
      }
    } else {
      try {
        const response = await queryStock(stock, like, ip);

        res.json(response);
      } catch (err) {
        res.status(500).json('Request failed');
      }
    }
  });
};
