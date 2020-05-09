module.exports = {
  dbconfig: {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "nodedb"
  },
  port: process.env.HTTP_PORT || 3000
};