import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../server';
import CardItem from './CardItem';
import CollapsibleDrawer from './CollapsibleDrawer';

const { authFetch } = require('../api/auth');

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
  }

  componentDidMount() {
    const listThis = this;
    authFetch(`${SERVER_ADDR}/myplants/`)
      .then((data) => {
        listThis.setState({
          loaded: true,
          plants: data,
          error: null,
        });
      }, (error) => {
        console.log(`Failed to load my plants. Reason: ${error}`);
        listThis.setState({ visible: false, error });
      });
  }

  removePlant(plant) {
    const { plants } = this.state;
    const idProp = '_id';
    const newPlants = plants.filter((cur) => cur[idProp].toString() !== plant[idProp].toString());
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

    const idProp = '_id'; // to prevent linter issues

    const cardsByLocation = [];
    for (let i = 0; i < plants.length; i += 1) {
      const plant = plants[i];
      const plantCard = (
        <CardItem
          key={plant[idProp]}
          plant={plant}
          styles={styles}
          onPressItem={onPressItem}
          onRemoveFromOwned={this.removePlant}
          allowChangePicture
        />
      );

      if (!cardsByLocation[plant.location]) {
        cardsByLocation[plant.location] = [plantCard];
      } else {
        cardsByLocation[plant.location].push(plantCard);
      }
    }

    const cardsAndHeaders = [];
    const locations = Object.keys(cardsByLocation);
    for (let i = 0; i < locations.length; i += 1) {
      const location = locations[i];
      const cards = cardsByLocation[location];
      cardsAndHeaders.push((
        <CollapsibleDrawer title={location} collapsed={false} key={location}>
          {cards}
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
