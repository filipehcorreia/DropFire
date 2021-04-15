const express = require('express')
const app = express();
const port = 3000;

var login_route = require("./routes/login_route");
var create_user_route = require("./routes/create_user_route.js");



app.use(express.json());
app.use('/auth/login',login_route);
app.use('/auth/signup',create_user_route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


app.get('/', async (req, res) => {
  res.json({status: "Let's go"});
}
);






