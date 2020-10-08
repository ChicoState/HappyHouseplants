const mongoose = require('mongoose');

function findDocuments(collectionName, query) {
  const promise = new Promise(resolve => {
    const collection = mongoose.connection.db.collection(collectionName);
    collection.find(query).toArray((err, docs) => {
      resolve(docs);
    });
  });
  return promise;
}

module.exports = { findDocuments };
