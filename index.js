const express = require('express')
const app = express();
const mysql = require('mysql');
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


app.get('/', async (req, res) => {
  res.json({status: "Bark Bark! Ready to roll"});
});

app.get('/get/:username', async (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?"
  pool.query(query,[req.params.username],(error, results) => {
    if (!results[0]){
      res.json({status: "Not Found"});
    }else{
      res.json(results[0])
    }
  });
});

app.get('/insert', async (req, res) => {
  const query = "INSERT INTO users VALUES (?,?)";
  pool.query(query,["alberto",12],(error) => {
    if (error){
      res.json({status: "error Found"});
    }else{
      res.json("yay")
    }
  });
});

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});


