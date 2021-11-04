const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'RAWR! Name, age, and level are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

// DeleteCode
const deleteDomo = (request, response) => {
  const req = request;
  const res = response;
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWR! Name is required' });
  }
  Domo.DomoModel.findByName(req.body.name, (err, doc) => {
    if (!doc) { // check if it exists
      return res.status(400).json({ error: 'RAWR! Domo does not exist!' });
    }
    return res;
  });

  return Domo.DomoModel.delete(req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;
