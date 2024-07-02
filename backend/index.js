const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SK_KEY);



// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose


mongoose
  .connect(
    `mongodb+srv://sanidhyapatidar14:S.1.anidhyA.4.@cluster0.rbys8tk.mongodb.net/client?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(
    console.log("MongoDB Connected Successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));

  // jwt authentication
  app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr'
    })
    res.send({token});
  })


//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentRoutes = require('./api/routes/paymentRoutes')

app.use('/menu', menuRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payment', paymentRoutes);


app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    payment_method_types: [ "card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});