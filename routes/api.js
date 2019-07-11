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

async function queryStock(stockName, like, ip) {
  const stock = stockName.toUpperCase();
  const url = `https://api.iextrading.com/1.0/stock/${stockName}/price`;

  const newStock = like ? { stock, $addToSet: { likeIps: ip } } : { stock };

  const [dbResponse, stockPrice] = await Promise.all([
    Stock.findOneAndUpdate({ stock }, newStock, {
      new: true,
      upsert: true,
    }),
    axios.get(url),
  ]);

  return {
    stock: dbResponse.stock,
    price: stockPrice.data,
    likes: dbResponse.likeIps.length,
  };
}

module.exports = (app) => {
  app.route('/api/stock-prices').get(async (req, res) => {
    const { stock, like } = req.query;
    const { ip } = req;

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
  });
};
