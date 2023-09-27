"use client";
import React, { useState } from "react";
import UserPage from "./components/User";
import { ethers } from "ethers";

function Metamask() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChanged([result[0]]);
        });
    } else {
      alert("Veuillez installer MetaMask sur Chrome");
    }
  };
  const disconnectWallet = () => {
    if (window.ethereum) {
      // Déconnectez le compte Metamask en réinitialisant les états
      setDefaultAccount(null);
      setUserBalance(null);
    }
  };

  async function sendTransaction() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
          to: "0x08bA45Cfa1a9A3EdbC55aED6f9FFd1305bD367CD",
          value: ethers.utils.parseEther("1.0"), // Envoyer 1 ETH
        });
        await tx.wait(); // Attendre la confirmation de la transaction
        console.log("Transaction réussie:", tx.hash);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la transaction:", error);
      }
    } else {
      alert("Veuillez installer MetaMask sur Chrome");
    }
  }

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    getUserBalance(accountName);
  };

  const getUserBalance = (accountAddress) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(accountAddress), "latest"],
      })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  return (
    <div className="text-center text-3xl">
      {defaultAccount ? (
        <div>
          <UserPage />
        </div>
      ) : (
        <button
          className="hover:bg-neutral-600 bg-neutral-800 hover:rounded-xl p-5 text-white font-bold border-red-100 duration-500"
          onClick={connectWallet}
        >
          Connecter votre Wallet avec Metamax
        </button>
      )}
    </div>
  );
}
// export async function getServerSideProps() {
//   // Effectuez une requête HTTP pour obtenir les données de l'utilisateur depuis votre API
//   try {
//     const response = await fetch("http://localhost:3000/api/auth/me"); // Remplacez par l'URL de votre API
//     if (!response.ok) {
//       throw new Error("Failed to fetch user data");
//     }

//     const userData = await response.json();

//     return {
//       props: {
//         userData,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return {
//       props: {
//         userData: null,
//       },
//     };
//   }
// }

export default Metamask;
