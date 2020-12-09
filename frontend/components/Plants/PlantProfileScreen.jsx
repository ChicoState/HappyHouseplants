import * as React from 'react';
import PlantProfile from './PlantProfile';

/**
 * Plant Profile Screen
 * @param {*} navContext
 */
function PlantProfileScreen(navContext) {
  const { route } = navContext;
  const { params } = route;
  return (<PlantProfile plantID={params.plantID} hideTitle={params.plantName !== undefined} />);
}

export default PlantProfileScreen;
