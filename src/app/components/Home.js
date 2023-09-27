"use client";
import React from "react";
import { Route, Navigate } from "react-router-dom";
import Metamask from "../Metamask";
import imageA from "../../app/medias/Image.jpg";
import { useUser } from "@auth0/nextjs-auth0/client";
import Container from "../components/Container";
import MyProfile from "./MyProfile";
function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>...Chargement</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    // Si l'utilisateur est connecté, affichez la page UserPage
    return (
      <div>
        <div className="flex justify-between mb-10 p-10 h-42 w-full items-center  bg-neutral-800">
          <h1 className="text-3xl">Tirok Test</h1>
          <div>
            <div className="flex cursor-pointer text-white text-xl justify-around gap-4">
              <button onClick={() => <Navigate to="/my-profile" />}>
                Profile
              </button>
              <button>My tokens</button>
            </div>
          </div>

          <button className="hover:bg-neutral-900 duration-500 text-white font-semibold text-lg rounded-lg p-4 bg-neutral-700">
            <a href="/api/auth/logout">Déconnexion</a>
          </button>
        </div>
        <div className=" ml-5 mb-10 text-left text-3xl font-semibold ">
          Bienvenue, {user.name}
        </div>
        <Container>
          <div className="h-96 w-full relative mb-10 m-auto">
            <img
              className=" h-full w-full brightness-50 object-cover rounded-3xl"
              src={imageA.src}
              alt=""
            />
            <center className="absolute top-1/2 right-2/3 text-white text-4xl">
              <b>Tirok, tokenise everything</b>
            </center>
          </div>
          <Metamask />
          {/* <UserPage />  */}
        </Container>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  return (
    <div className="text-center absolute top-2/4 right-[40%] text-3xl">
      <h1 className="text-6xl mb-10">Tirok Test</h1>
      <button
        className="hover:bg-neutral-600 bg-neutral-800 hover:rounded-xl p-5 border-red-100 duration-1000"
        onClick={() => (window.location.href = "/api/auth/login")}
      >
        S'inscrire ou Se connecter
      </button>
    </div>
  );
}

export default Home;
