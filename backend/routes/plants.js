const { findDocuments } = require('../database/findDocuments');

module.exports = (app) => {
  app.get('/plants/', (req, res) => {
    const plantsQuery = {};
    findDocuments('Plants', plantsQuery).then((docs) => {
      res.json(docs);
    });
  });

  app.get('/plants/:plantID', (req, res) => {
    const userQuery = { plantID: req.params.plantID };
    findDocuments('Plants', userQuery).then((docs) => {
      if (docs.length < 1) {
        res.status(404).json({});
      } else {
        res.json(docs[0]);
      }
    });
  });
};
