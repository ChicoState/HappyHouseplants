import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import CardItem from '../CardItem';
import CollapsibleDrawer from '../../Util/CollapsibleDrawer';

const { getMyPlants, groupPlantsByLocation } = require('../../../api/myplants');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
});

class MyPlantsList extends Component {
  constructor() {
    super();
    this.removePlant = this.removePlant.bind(this);
    this.state = {
      loaded: false,
      error: null,
      plants: [],
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const listThis = this;
    getMyPlants()
      .then((plants) => {
        listThis.setState({
          loaded: true,
          plants,
          error: null,
        });
      }, (error) => {
        console.log(`Failed to load my plants. Reason: ${error}`);
        listThis.setState({ visible: false, error });
      });
  }

  removePlant(plant) {
    const { plants } = this.state;
    const newPlants = plants.filter(
      (cur) => cur.instanceID.toString() !== plant.instanceID.toString(),
    );
    this.setState({
      plants: newPlants,
    });
  }

  render() {
    const { loaded, error, plants } = this.state;
    const { onPressItem } = this.props;
    if (error) {
      const errMsg = `Failed to load plants.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Spinner />);
    }

    const plantsByLocation = groupPlantsByLocation(plants);
    const cardsAndHeaders = [];
    const locations = Object.keys(plantsByLocation);
    for (let i = 0; i < locations.length; i += 1) {
      const location = locations[i];
      const plantsInThisLocation = plantsByLocation[location];
      const cardsInThisLocation = plantsInThisLocation.map((plant) => (
        <CardItem
          key={plant.instanceID}
          plant={plant}
          styles={styles}
          onPressItem={onPressItem}
          onRemoveFromOwned={this.removePlant}
          onRefresh={this.refresh}
          isCustomized
        />
      ));
      cardsAndHeaders.push((
        <CollapsibleDrawer title={location} collapsed={false} key={location}>
          {cardsInThisLocation}
        </CollapsibleDrawer>
      ));
    }

    const emptyNotice = plants.length === 0
      ? (
        <Text style={{ width: '100%', textAlign: 'center', marginTop: '10%' }}>
          You don&apos;t own any plants
        </Text>
      ) : undefined;

    return (
      <Layout style={styles.container}>
        {emptyNotice}
        <ScrollView>
          {cardsAndHeaders}
        </ScrollView>
      </Layout>
    );
  }
}

MyPlantsList.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default MyPlantsList;
