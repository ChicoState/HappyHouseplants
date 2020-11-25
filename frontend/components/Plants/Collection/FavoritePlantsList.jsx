import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import CardItem from '../CardItem';

const {
  getFavorites,
} = require('../../../api/favoritePlants');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
});

class FavoritePlantsList extends Component {
  constructor() {
    super();
    this.removeFavoritePlant = this.removeFavoritePlant.bind(this);
    this.state = {
      loaded: false,
      error: null,
      plants: [],
    };
  }

  componentDidMount() {
    const listThis = this;
    getFavorites()
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

  removeFavoritePlant(plant) {
    const { plants } = this.state;
    const newPlants = plants.filter((cur) => cur.plantID !== plant.plantID);
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

    const cards = plants.map((plant) => (
      <CardItem
        key={plant.plantID}
        plant={plant}
        styles={styles}
        onPressItem={onPressItem}
        onRemoveFromFavorites={this.removeFavoritePlant}
      />
    ));

    const emptyNotice = plants.length === 0
      ? (
        <Text style={{ width: '100%', textAlign: 'center', marginTop: '10%' }}>
          You don&apos;t have any favorite plants
        </Text>
      ) : undefined;

    return (
      <Layout style={styles.container}>
        {emptyNotice}
        <ScrollView>
          {cards}
        </ScrollView>
      </Layout>
    );
  }
}

FavoritePlantsList.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default FavoritePlantsList;
