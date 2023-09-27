import React, { useState } from "react";
import axios from "axios";

function ReloadBalance() {
  const [amount, setAmount] = useState(0);
  const [rechargeVisible, setRechargeVisible] = useState(false);

  const toggleRecharge = () => {
    setRechargeVisible(!rechargeVisible);
  };

  async function createCheckoutSession(amount) {
    try {
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const { sessionId } = await response.json();

      // Rediriger l'utilisateur vers la page de paiement Stripe
      const stripe = Stripe(
        "sk_test_51N4EXwFvhukrx6EvbliYN4Nih5tXbaBcH6N81FJvkIPSa6A55IxQgYS1Qq4VXXtebwRNVZuOJAPGHF5wCsB1v11L005o8q1Vc9"
      );
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(
          "Erreur de redirection vers la page de paiement Stripe :",
          error
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement :",
        error
      );
    }
  }

  return (
    <div>
      {rechargeVisible && (
        <div>
          <input
            className="text-gray-950"
            type="number"
            placeholder="Montant en EUR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => createCheckoutSession(amount)}>
            Recharger
          </button>
        </div>
      )}{" "}
      <button className="text-base" onClick={toggleRecharge}>
        {rechargeVisible ? "Annuler" : "Recharger"}
      </button>
    </div>
  );
}

export default ReloadBalance;
