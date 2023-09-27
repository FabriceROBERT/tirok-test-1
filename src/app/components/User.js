import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ReloadBalance from "./RechargeStripe";
import { insertUserData } from "../../../database";
import axios from "axios";
import Link from "next/link";

function UserPage() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionsVisible, setTransactionsVisible] = useState(false);

  const toggleTransactions = () => {
    setTransactionsVisible(!transactionsVisible);
  };

  // const axios = require("axios"); // Assurez-vous d'importer Axios

  axios
    .get("http://localhost:3000/api/auth/me")
    .then((response) => {
      const userData = response.data; // Les données du "current user"

      // Utilisez ces données pour insérer dans la base de données PostgreSQL
      insertUserData(userData);
      console.log(userData);
    })
    .catch((error) => {
      console.error(
        'Erreur lors de la récupération des données du "current user":',
        error
      );
    });

  const disconnectWallet = () => {
    if (window.ethereum) {
      // Déconnectez le compte Metamask en réinitialisant les états
      setDefaultAccount(null);
      setUserBalance(null);
    }
  };

  const handleLogoutClick = () => {
    disconnectWallet(); // Appel de la fonction disconnectWallet
    window.location.href = "/api/auth/logout"; // Redirection vers la page de déconnexion
  };

  useEffect(() => {
    async function fetchTransactionHistory() {
      try {
        // Obtenir l'adresse de l'utilisateur connecté
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            const userAddress = accounts[0];
            setDefaultAccount(userAddress);
            const apiKey = "5VDJQNFBXFPKQHQ3K1YZAS7MWTFCRHFBZR";
            const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
            const response = await axios.get(apiUrl);

            if (response.data.status === "1") {
              setTransactions(response.data.result);
              setLoading(false);
            } else {
              setError(
                "Erreur lors de la récupération de l'historique des transactions : " +
                  response.data.message
              );
              setLoading(false);
            }
          }
        }
      } catch (error) {
        setError(
          "Erreur lors de la récupération de l'historique des transactions : " +
            error.message
        );
        setLoading(false);
      }
    }

    fetchTransactionHistory();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length >= 0) {
            const account = accounts[0];
            setDefaultAccount(account);
            getUserBalance(account);
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du compte Metamask :",
            error
          );
        });
    }
  }, []);

  const getUserBalance = (accountAddress) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(accountAddress), "latest"],
      })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du solde :", error);
      });
  };

  return (
    <div className="bg-neutral-800  rounded-lg p-5">
      {defaultAccount ? (
        <div>
          <div className="text-center text-lg">
            <h3>Votre adresse : {defaultAccount} </h3>
            <h3>Votre solde: {userBalance} ETH</h3>

            <button onClick={toggleTransactions}>
              {transactionsVisible
                ? "Fermer les transactions"
                : "Afficher les transactions"}
            </button>
            {transactionsVisible && (
              <div>
                <h1>Historique des transactions :</h1>
                {loading ? (
                  <p>Chargement en cours...</p>
                ) : error ? (
                  <p>Erreur : {error}</p>
                ) : (
                  <ul>
                    {transactions.map((transaction, index) => (
                      <li key={index}>
                        Transaction #{index + 1}: {transaction.hash}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <ReloadBalance />
            <br />
          </div>
          <button
            className="hover:bg-neutral-500 bg-neutral-700 text-sm  hover:rounded-lg p-5 text-center border-red-100 duration-500"
            onClick={handleLogoutClick}
          >
            Detacher votre Wallet
          </button>
        </div>
      ) : (
        <p>Redirection...</p>
      )}
    </div>
  );
}

export default UserPage;
