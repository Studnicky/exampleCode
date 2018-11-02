var express = require('express');
var router = express.Router();
var createError = require('http-errors');

const ValueController = require('../controllers/valueController');
/* GET users listing. */

router.get('/:value', (req, res) => {

  //  Deconstructing args immediately lets me specify exactly references go to each method in the chain
  let {
    params: {
      value: initialValue
    },
    query: {
      age,
      mileage,
      owners,
      collisions
    }
  } = req;

  //  This may seem a little extra, but it enables HTTP caching
  //  Normally I would use a schema but this is supposed to be quick
  initialValue = parseFloat( initialValue, 10 );
  age = parseInt( age, 10 );
  mileage = parseInt( mileage, 10 );
  owners = parseInt( owners, 10 );
  collisions = parseInt( collisions, 10 );

  ValueController.calculateValue(initialValue, age, mileage, owners, collisions)
  .then((estimatedValue) => {
    res.json({
      initialValue: Number.parseFloat(initialValue).toFixed(2),
      estimatedValue: Number.parseFloat(estimatedValue).toFixed(2)
      });
  })
  .catch((err) => {
    const httpError = new createError.NotFound(404, err);
    console.log(err);
    res.send(httpError);
  });

});

module.exports = router;
