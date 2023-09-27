const express = require("express");
const stripe = require("stripe")("sk_test_51N4EXwFvhukrx6EvbliYN4Nih5tXbaBcH6N81FJvkIPSa6A55IxQgYS1Qq4VXXtebwRNVZuOJAPGHF5wCsB1v11L005o8q1Vc9");
const app = express();

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Recharge de solde",
          },
          unit_amount: amount * 100, 
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/succes",
    cancel_url: "http://localhost:3000/annulation ",
  });

  res.json({ sessionId: session.id });
});

app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur le port 3000");
});
