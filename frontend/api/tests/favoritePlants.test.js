const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} = require('../favoritePlants');
const { registerAndLogin } = require('./testutil');

beforeEach((done) => {
  registerAndLogin()
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
});

it('Favorite plants are empty by default', () => {
  expect(getFavorites()).resolves.toStrictEqual([]);
});

it('Can add plant to favorites', (done) => {
  const plant = {
    plantID: 'MyPlantID',
    name: 'My Favorite Plant Name',
    image: { sourceURL: 'test' },
  };

  addToFavorites(plant)
    .then((result) => {
      expect(result).toBe(true);

      // Check that it was really added to favorites
      getFavorites()
        .then((favorites) => {
          expect(favorites).toHaveLength(1);
          expect(favorites[0]).toStrictEqual(plant);
          done();
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can check if plant is in favorites', (done) => {
  const plant = {
    plantID: 'MyPlantID',
    name: 'My Favorite Plant Name',
    image: { sourceURL: 'test' },
  };

  addToFavorites(plant)
    .then((result) => {
      expect(result).toBe(true);
      expect(isFavorite(plant.plantID)).resolves.toBe(true);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

it('Can check if non-favorite plant is favorites', (done) => {
  const plant = {
    plantID: 'MyPlantID',
    name: 'My Favorite Plant Name',
    image: { sourceURL: 'test' },
  };

  addToFavorites(plant)
    .then((result) => {
      expect(result).toBe(true);
      expect(isFavorite('FakePlantID')).resolves.toBe(false);
      done();
    })
    .catch((error) => {
      done(error);
    });
});

it('Can update favorite plant by ID', (done) => {
  const plant = {
    plantID: 'MyPlantID',
    name: 'My Favorite Plant Name',
    image: { sourceURL: 'test' },
  };

  addToFavorites(plant)
    .then((addResult) => {
      expect(addResult).toBe(true);

      // Update the plant
      plant.name = 'My Updated Favorite Plant Name';

      // Re-add it to favorites
      addToFavorites(plant)
        .then((repeatResult) => {
          expect(repeatResult).toBe(false); // False indicates update rather than insert

          // Check that it was really updated in favorites
          getFavorites()
            .then((favorites) => {
              expect(favorites).toHaveLength(1);
              expect(favorites[0]).toStrictEqual(plant);
              done();
            })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can remove from favorites', (done) => {
  const plant = {
    plantID: 'MyPlantID',
    name: 'My Favorite Plant Name',
    image: { sourceURL: 'test' },
  };

  addToFavorites(plant)
    .then((addResult) => {
      expect(addResult).toBe(true);

      removeFromFavorites(plant.plantID)
        .then((removeResult) => {
          expect(removeResult).toBe(true);

          // Check that it was really removed from favorites
          getFavorites()
            .then((favorites) => {
              expect(favorites).toStrictEqual([]);
              done();
            })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});
