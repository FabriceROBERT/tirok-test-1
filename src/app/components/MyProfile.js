import React from "react";

function MyProfile() {
  return (
    <div>
      <div>
        <h1 className="text-center text-3xl my-10">Mon Profil</h1>

        <div>
          <form
            action=""
            method="post"
            className=" flex flex-col w-fit space-y-5 mx-auto"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                name="Nom"
                className="contactInput"
                placeholder="Votre nom"
                id=""
              />
              <input
                type="text"
                name="Prenom"
                className="contactInput"
                id=""
                placeholder="Votre prénom"
              />
            </div>

            <input
              type="number"
              name=""
              className="contactInput"
              placeholder="+33"
              id=""
            />
            <input
              type="email"
              name=""
              className="contactInput"
              placeholder="Votre email"
            />

            <input
              type="password"
              placeholder="Changer de mot de passe"
              className="contactInput"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="contactInput"
              name=""
              id=""
            />

            <input type="file" className="contactInput" name="" id="" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
