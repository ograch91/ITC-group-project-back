const express = require('express');
const cors = require('cors');

const { ValidRes, internalErr } = require('./lib/responseHandler');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    // origin: 'http://localhost:3000',
  })
);

app.use((req, res, next) => {
  res.ok = data => {
    res.respond(ValidRes(data));
  };

  res.respond = resp => {
    res.status(resp.status).json(resp.payload); 
  };
  next();
});

// generic error handler for all routes
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    next(internalErr());
  }
});



app.use((err, req, res, next) => {
  console.log('err ->>> ', err);
  res.respond(err);
});

const port = process.env.PORT || 4000 
app.listen(port, () => {
  console.log('Express is listening on port ' + port);
});
