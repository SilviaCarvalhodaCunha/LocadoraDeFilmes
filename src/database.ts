import { Client } from "pg";

const client: Client = new Client({
  host: "localhost",
  port: 5432,
  database: "entrega_locadora",
  user: "User",
  password: "121916",
});

const connectDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Conexão feita.");
};

export { client, connectDatabase };
