const mysql = require('mysql');
const { promisify } = require('util');
const _ = require('lodash');

const connection = mysql.createPool({
  host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
  database: 'airline',
  user: 'bsale_test',
  password: 'bsale_test',
  connectionLimit: 10,
  acquireTimeout: 5000,
});

const query = promisify(connection.query).bind(connection);

async function searchByFlightId(flightId) {
  const sql = `
    SELECT
      f.flight_id AS flightId,
      f.takeoff_date_time AS takeoffDateTime,
      f.takeoff_airport AS takeoffAirport,
      f.landing_date_time AS landingDateTime,
      f.landing_airport AS landingAirport,
      f.airplane_id AS airplaneId,
      b.boarding_pass_id AS boardingPassId,
      b.purchase_id AS purchaseId,
      b.seat_type_id AS seatTypeId,
      b.seat_id AS seatId,
      p.passenger_id AS passengerId,
      p.dni,
      p.name,
      p.age,
      p.country
    FROM
      boarding_pass b
      LEFT JOIN flight f ON b.flight_id = f.flight_id
      LEFT JOIN passenger p ON b.passenger_id = p.passenger_id
    WHERE
      b.flight_id = ?`;

  const results = await query(sql, [flightId]);
  const formattedResults = formatResults(results);
  return formattedResults;
}

function formatResults(results) {
  return {
    flightId: _.get(results, '[0].flightId'),
    takeoffDateTime: _.get(results, '[0].takeoffDateTime'),
    takeoffAirport: _.get(results, '[0].takeoffAirport'),
    landingDateTime: _.get(results, '[0].landingDateTime'),
    landingAirport: _.get(results, '[0].landingAirport'),
    airplaneId: _.get(results, '[0].airplaneId'),
    passengers: results.map((result) => ({
      passengerId: result.passengerId,
      dni: result.dni,
      name: result.name,
      age: result.age,
      country: result.country,
      boardingPassId: result.boardingPassId,
      purchaseId: result.purchaseId,
      seatTypeId: result.seatTypeId,
      seatId: result.seatId,
    })),
  };
}

module.exports = { searchByFlightId };
