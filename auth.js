const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const users = [
  {
    username: 'john',
    password: 'password123admin',
    role: 'admin'
  }, {
    username: 'anna',
    password: 'password123member',
    role: 'member'
  }
];

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

app.use(bodyParser.json());
app.listen(3000, () => {
  console.log("Server up at port: 3000");
});

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const data = {username: user.username, role: user.role};
    const accessToken = jwt.sign(data, accessTokenSecret, {expiresIn: '20m'});
    const refreshToken = jwt.sign(data, refreshTokenSecret);

    refreshTokens.push(refreshToken);

    res.json({accessToken, refreshToken});
  } else {
    res.send('Username or password is incorrect');
  }
});

app.post('/token', (req, res) => {
  const {token} = req.body;
  
  if (!token)
    return res.sendStatus(401);
  if (!refreshTokens.includes(token))
    return res.sendStatus(403);
  
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err)
      return res.sendStatus(403);

      const data = {username: user.username, role: user.role};
      const accessToken = jwt.sign(data, accessTokenSecret, {expiresIn: '20m'});

      res.json({accessToken});
  })
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(token => t !== token);

  res.send("Logout successful");
});