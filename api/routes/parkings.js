const express = require('express');

const router = express.Router();

const Moment = require('moment');

const Parking = require('../models/parking');

const equatorial_radius_earth_km = 6371;

function parsePoint(point) {
  return { lat: point.coordinates[0], lng: point.coordinates[1] };
}

router.get('/', (req, res) => {
  console.log(req.query);
  // Parking.find({
  //   location: {
  //     $geoWithin:
  //       { $centerSphere: [[-8.038149, -34.945147], 0.5 / equatorial_radius_earth_km] }
  //   }
  // }).then(result => {
  //   res.status(200).json(result)
  // }).catch(err => {
  //   res.status(500).json({
  //     error: err
  //   });
  // });
  const latitude = parseFloat(req.query.lat);
  const longitude = parseFloat(req.query.lng);
  const radius = parseFloat(req.query.radius);

  Parking.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
        distanceField: "distance",
        spherical: true,
        distanceMultiplier: 1 / equatorial_radius_earth_km
      }
    },
    // Calculate if distance is within radius and remove if not
    {
      $redact: {
        $cond: {
          if: { "$lte": ["$distance", { $add: [radius, "$radius"] }] },
          then: "$$KEEP",
          else: "$$PRUNE"
        }
      }
    }
  ]).then(parkings => {
    for (let i = 0; i < parkings.length; i++) {
      parkings[i].location = parsePoint(parkings[i].location);
    }
    res.status(200).json(parkings)
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  });
});


function parseParking(parking) {
  return {
    name: parking.name,
    hourPrice: parking.hourPrice,
    openingTime: Moment.utc(parking.openingTime, 'HH:mm:ss'),
    closingTime: Moment.utc(parking.closingTime, 'HH:mm:ss'),
    location: { type: 'Point', coordinates: parking.location },
    radius: parking.radius
  };
}

router.post('/', (req, res) => {
  const parking = parseParking(req.body);

  Parking
    .create(parking)
    .then(doc => {
      res.status(201).json(doc);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;