const { findDocuments, findOneDocument } = require('../database/findDocuments');
const { authenticateUserRequest } = require('../api/auth.js');

module.exports = (app) => {
  app.get('/random_tips/', (req, res) => {
    const maxCount = req.query.count ? req.query.count : 10;
    const tipsQuery = {};
    findDocuments('tips', tipsQuery).then((docs) => {
      const shuffledDocs = docs;
      // Shuffle the documents
      for (let i = shuffledDocs.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const hold = docs[i];
        shuffledDocs[i] = docs[j];
        shuffledDocs[j] = hold;
      }
      const endIndex = Math.min(maxCount, shuffledDocs.length);
      res.json(shuffledDocs.slice(0, endIndex).map((tip) => tip.tipID));
    });
  });

  app.get('/tips/', (req, res) => {
    const tipsQuery = {};
    findDocuments('tips', tipsQuery).then((docs) => {
      res.json(docs);
    });
  });

  app.get('/tips/:tipID', (req, res) => {
    const tipQuery = { tipID: req.params.tipID };
    findDocuments('tips', tipQuery).then((docs) => {
      if (docs.length < 1) {
        res.status(404).json({});
      } else {
        res.json(docs[0]);
      }
    });
  });

  app.get('/mytips', (req, res) => {
    authenticateUserRequest(req, res).then((userId) => {
      if (userId) {
        findOneDocument('Users', { userId }).then((user) => {
          res.json(user.savedTipsByID);
        });
      } else {
        res.status(403).json({});
      }
    });
  });
};
