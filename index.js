const express = require('express');
const app = express();
const port = 3000;
const { searchByFlightId } = require('./connection');

app.get('/', (req, res) => {
  res.send('Hola, mi servidor en Express');
});

app.get('/flights/:id/passengers', async (req, res) => {
  const flightId = req.params.id;
  const data = await searchByFlightId(flightId);
  if (data.passengers.length === 0) {
    res.json({
      code: 404,
      data: {},
    });
  } else {
    res.json({
      code: 200,
      data: data,
    });
  }
});

app.listen(port, () => {
  console.log('Mi puerto: ' + port);
});
