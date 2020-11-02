const PG_CONNECTION_STRING = process.env.DATABASE_URL || "";
const PORT = process.env.PORT || "";

export { PG_CONNECTION_STRING, PORT };
