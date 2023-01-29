let DB_URI = "mongodb+srv://user001:abcdefgh@cluster0.svaad.mongodb.net/?retryWrites=true&w=majority";

if (process.env.MONGO_DB_URI) {
  DB_URI = process.env.MONGO_DB_URI;
}

module.exports = {
  DB_URI,
  CURRENCY_API: 'https://api.apilayer.com/currency_data/convert',
  CURRENCY_API_KEY: 'tAT1IDw5b6hMXDakoTjVsuG2T35uP1Dq'
};
