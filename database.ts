import { Pool } from "pg";

// Configuration de la connexion à la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres:2508@localhost:5432/tirok",
});



pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database error:", err);
});

// Exécuter une requête
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}

// Fonction pour insérer des données utilisateur dans la base de données
export async function insertUserData(userData) {
  const queryText = `
    INSERT INTO users (name, email, ethereum_address, kyc_status, document_id)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    userData.name,
    userData.email,
    userData.ethereum_address,
    userData.kyc_status,
    userData.document_id,
  ];

  try {
    const result = await query(queryText, values);
    console.log("Data inserted successfully.");
    return result;
  } catch (err) {
    throw err;
  }
}

// Fermer la connexion à la base de données
async function closeDatabaseConnection() {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
}

export default {
  query,
  insertUserData,
  closeDatabaseConnection,
};

