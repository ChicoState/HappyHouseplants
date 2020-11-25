const {
  getMyPlants,
  addToMyPlants,
  removeFromMyPlants,
  updateMyPlant,
  getMyPlantLocations,
  DefaultPlantLocations,
  groupPlantsByLocation,
} = require('../myplants');
const {
  authFetch,
} = require('../auth');
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

it('Myplants is empty by default', () => {
  expect(getMyPlants()).resolves.toStrictEqual([]);
});

it('Can add to myplants', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Ensure that it is now stored in 'myplants'
      getMyPlants()
        .then((myPlants) => {
          expect(myPlants).toBeTruthy();
          expect(myPlants).toHaveLength(1);
          expect(myPlants[0].instanceID).toStrictEqual(instanceID);
          expect(myPlants[0].name).toStrictEqual('My Plant Name');
          expect(myPlants[0].location).toStrictEqual('Kitchen');
          expect(myPlants[0].image).toStrictEqual({ sourceURL: 'testURL' });
          done();
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can own multiple plants', (done) => {
  // Add the first plant
  addToMyPlants('MyPlantID1', 'My Plant Name 1', 'Kitchen', { sourceURL: 'testURL1' })
    .then((instanceID1) => {
      expect(instanceID1).toBeTruthy();

      // Add the second plant
      addToMyPlants('MyPlantID2', 'My Plant Name 2', 'Living room', { sourceURL: 'testURL2' })
        .then((instanceID2) => {
          expect(instanceID2).toBeTruthy();

          // Add the third plant
          addToMyPlants('MyPlantID3', 'My Plant Name 3', 'Porch', { sourceURL: 'testURL3' })
            .then((instanceID3) => {
              expect(instanceID3).toBeTruthy();

              // Ensure that all plants are stored in 'myplants'
              getMyPlants()
                .then((myPlants) => {
                  expect(myPlants).toBeTruthy();
                  expect(myPlants).toHaveLength(3);

                  const plant1 = myPlants.find((cur) => cur.instanceID === instanceID1);
                  expect(plant1.name).toStrictEqual('My Plant Name 1');
                  expect(plant1.location).toStrictEqual('Kitchen');
                  expect(plant1.image).toStrictEqual({ sourceURL: 'testURL1' });

                  const plant2 = myPlants.find((cur) => cur.instanceID === instanceID2);
                  expect(plant2.name).toStrictEqual('My Plant Name 2');
                  expect(plant2.location).toStrictEqual('Living room');
                  expect(plant2.image).toStrictEqual({ sourceURL: 'testURL2' });

                  const plant3 = myPlants.find((cur) => cur.instanceID === instanceID3);
                  expect(plant3.name).toStrictEqual('My Plant Name 3');
                  expect(plant3.location).toStrictEqual('Porch');
                  expect(plant3.image).toStrictEqual({ sourceURL: 'testURL3' });
                  done();
                });
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

it('Can remove from myplants', (done) => {
  // Add the first plant
  addToMyPlants('MyPlantID1', 'My Plant Name 1', 'Kitchen', { sourceURL: 'testURL1' })
    .then((instanceID1) => {
      expect(instanceID1).toBeTruthy();

      // Add the second plant
      addToMyPlants('MyPlantID2', 'My Plant Name 2', 'Living room', { sourceURL: 'testURL2' })
        .then((instanceID2) => {
          expect(instanceID2).toBeTruthy();

          // Add the third plant
          addToMyPlants('MyPlantID3', 'My Plant Name 3', 'Porch', { sourceURL: 'testURL3' })
            .then((instanceID3) => {
              expect(instanceID3).toBeTruthy();

              // Remove the second plant
              removeFromMyPlants(instanceID2)
                .then(() => {
                // Ensure that only the first and third plants remain in 'myplants'
                  getMyPlants()
                    .then((myPlants) => {
                      expect(myPlants).toBeTruthy();
                      expect(myPlants).toHaveLength(2);

                      const plant1 = myPlants.find((cur) => cur.instanceID === instanceID1);
                      expect(plant1.name).toStrictEqual('My Plant Name 1');
                      expect(plant1.location).toStrictEqual('Kitchen');
                      expect(plant1.image).toStrictEqual({ sourceURL: 'testURL1' });

                      const plant2 = myPlants.find((cur) => cur.instanceID === instanceID2);
                      expect(plant2).toBeUndefined();

                      const plant3 = myPlants.find((cur) => cur.instanceID === instanceID3);
                      expect(plant3.name).toStrictEqual('My Plant Name 3');
                      expect(plant3.location).toStrictEqual('Porch');
                      expect(plant3.image).toStrictEqual({ sourceURL: 'testURL3' });
                      done();
                    });
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
    })
    .catch((error) => {
      done(error);
    });
});

it('Cannot remove non-existing plant from myplants', () => {
  expect(removeFromMyPlants('FakeID')).rejects.toThrow();
});

it('Can update plant name', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Update the plant's name
      updateMyPlant(instanceID, { name: 'My New Plant Name' })
        .then((newPlantState) => {
          // Ensure that the resolved plant matches what's expected
          expect(newPlantState).toStrictEqual({
            plantID: 'MyPlantID',
            instanceID,
            name: 'My New Plant Name',
            location: 'Kitchen',
            image: { sourceURL: 'testURL' },
          });

          // Ensure that it is now updated in 'myplants'
          getMyPlants()
            .then((myPlants) => {
              expect(myPlants).toBeTruthy();
              expect(myPlants).toHaveLength(1);
              expect(myPlants[0]).toStrictEqual(newPlantState);
              done();
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

it('Can update plant location', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Update the plant's location
      updateMyPlant(instanceID, { location: 'New Location' })
        .then((newPlantState) => {
          // Ensure that the resolved plant matches what's expected
          expect(newPlantState).toStrictEqual({
            plantID: 'MyPlantID',
            instanceID,
            name: 'My Plant Name',
            location: 'New Location',
            image: { sourceURL: 'testURL' },
          });

          // Ensure that it is now updated in 'myplants'
          getMyPlants()
            .then((myPlants) => {
              expect(myPlants).toBeTruthy();
              expect(myPlants).toHaveLength(1);
              expect(myPlants[0]).toStrictEqual(newPlantState);
              done();
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

it('Can update plant image by URL', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Update the plant's image URL
      updateMyPlant(instanceID, { image: { sourceURL: 'newURL' } })
        .then((newPlantState) => {
          // Ensure that the resolved plant matches what's expected
          expect(newPlantState).toStrictEqual({
            plantID: 'MyPlantID',
            instanceID,
            name: 'My Plant Name',
            location: 'Kitchen',
            image: { sourceURL: 'newURL' },
          });

          // Ensure that it is now updated in 'myplants'
          getMyPlants()
            .then((myPlants) => {
              expect(myPlants).toBeTruthy();
              expect(myPlants).toHaveLength(1);
              expect(myPlants[0]).toStrictEqual(newPlantState);
              done();
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

it('Can update multiple plant properties simultaneously', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Update the plant's properties all at once
      updateMyPlant(instanceID, {
        name: 'My New Plant Name',
        location: 'Porch',
        image: { sourceURL: 'newURL' },
      })
        .then((newPlantState) => {
          // Ensure that the resolved plant matches what's expected
          expect(newPlantState).toStrictEqual({
            plantID: 'MyPlantID',
            instanceID,
            name: 'My New Plant Name',
            location: 'Porch',
            image: { sourceURL: 'newURL' },
          });

          // Ensure that it is now updated in 'myplants'
          getMyPlants()
            .then((myPlants) => {
              expect(myPlants).toBeTruthy();
              expect(myPlants).toHaveLength(1);
              expect(myPlants[0]).toStrictEqual(newPlantState);
              done();
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

it('Can update plant image by base64', (done) => {
  // Add the plant
  addToMyPlants('MyPlantID', 'My Plant Name', 'Kitchen', { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Update the plant's image by base64
      updateMyPlant(instanceID, { image: { base64: 'SGVsbG8=' } })
        .then((newPlantState) => {
          // Ensure that the resolved plant matches what's expected
          expect(newPlantState.plantID).toStrictEqual('MyPlantID');
          expect(newPlantState.instanceID).toStrictEqual(instanceID);
          expect(newPlantState.name).toStrictEqual('My Plant Name');
          expect(newPlantState.location).toStrictEqual('Kitchen');
          expect(newPlantState.image.authenticationRequired).toBe(true);
          expect(newPlantState.image.sourceURL).toBeTruthy();

          // Ensure that it is now updated in 'myplants'
          getMyPlants()
            .then((myPlants) => {
              expect(myPlants).toBeTruthy();
              expect(myPlants).toHaveLength(1);
              expect(myPlants[0]).toStrictEqual(newPlantState);

              // And ensure that we can load the image via an authFetch
              authFetch(newPlantState.image.sourceURL)
                .then((imageResponse) => {
                  expect(imageResponse).toStrictEqual('SGVsbG8=');
                  done();
                })
                .catch((error) => {
                  done(error);
                });
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

it('Plant locations are empty by default', () => {
  expect(getMyPlantLocations(false)).resolves.toStrictEqual([]);
});

it('Plant locations optionally include defaults when empty', () => {
  expect(getMyPlantLocations(true)).resolves.toStrictEqual(DefaultPlantLocations.sort());
});

it('Single default plant location works', (done) => {
  // Add the plant
  const location = DefaultPlantLocations[1];
  addToMyPlants('MyPlantID', 'My Plant Name', location, { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Check that the plant's location is recognized
      getMyPlantLocations()
        .then((locations) => {
          expect(locations).toHaveLength(1);
          expect(locations[0]).toStrictEqual(location);
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

it('Single custom plant location works', (done) => {
  // Add the plant
  const location = 'My custom location';
  addToMyPlants('MyPlantID', 'My Plant Name', location, { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Check that the plant's location is recognized
      getMyPlantLocations(false)
        .then((locations) => {
          expect(locations).toHaveLength(1);
          expect(locations[0]).toStrictEqual(location);
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

it('Mix custom and default plant locations works', (done) => {
  // Add the plant
  const location = 'My custom location';
  addToMyPlants('MyPlantID', 'My Plant Name', location, { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Check that the plant's location is recognized in addition to defaults
      getMyPlantLocations(true)
        .then((locations) => {
          expect(locations).toHaveLength(DefaultPlantLocations.length + 1);
          expect(locations.sort()).toStrictEqual(DefaultPlantLocations.concat(location).sort());
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

it('Owning plants in default locations will not cause duplicate rooms', (done) => {
  // Add the plant
  const location = DefaultPlantLocations[2];
  addToMyPlants('MyPlantID', 'My Plant Name', location, { sourceURL: 'testURL' })
    .then((instanceID) => {
      expect(instanceID).toBeTruthy();

      // Check that the plant's location is recognized in addition to defaults
      getMyPlantLocations(true)
        .then((locations) => {
          expect(locations).toHaveLength(DefaultPlantLocations.length);
          expect(locations.sort()).toStrictEqual(DefaultPlantLocations.sort());
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

it('Group plants by location works', () => {
  const plants = [
    {
      instanceID: 'Instance1',
      plantID: 'MyID1',
      name: 'My First Plant',
      location: 'Location A',
      image: { sourceURL: 'testURL' },
    },
    {
      instanceID: 'Instance2',
      plantID: 'MyID2',
      name: 'My Second Plant',
      location: 'Location B',
      image: { sourceURL: 'testURL' },
    },
    {
      instanceID: 'Instance3',
      plantID: 'MyID3',
      name: 'My Third Plant',
      location: 'Location C',
      image: { sourceURL: 'testURL' },
    },
    {
      instanceID: 'Instance4',
      plantID: 'MyID4',
      name: 'My Fourth Plant',
      location: 'Location C',
      image: { sourceURL: 'testURL' },
    },
    {
      instanceID: 'Instance5',
      plantID: 'MyID5',
      name: 'My Fifth Plant',
      location: 'Location A',
      image: { sourceURL: 'testURL' },
    },
    {
      instanceID: 'Instance6',
      plantID: 'MyID6',
      name: 'My Sixth Plant',
      location: 'Location B',
      image: { sourceURL: 'testURL' },
    },
  ];

  const byLocation = groupPlantsByLocation(plants);
  const expectedLocations = ['Location A', 'Location B', 'Location C'].sort();

  expect(Object.keys(byLocation).sort()).toStrictEqual(expectedLocations);
  for (let i = 0; i < expectedLocations.length; i += 1) {
    const location = expectedLocations[i];
    expect(byLocation[location].sort())
      .toStrictEqual(plants.filter((cur) => cur.location === location).sort());
  }
});

it('Group empty set of plants by location works', () => {
  expect(groupPlantsByLocation([])).toStrictEqual({});
});
