import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../server';
import CardItem from './CardItem';

const { authFetch } = require('../auth');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
});

class MyPlantsList extends Component {
  constructor() {
    super();
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
        console.log(`Received plants: ${JSON.stringify(data)}`);
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

    const id = '_id'; // to prevent linter issues
    const myCards = plants.map((plant) => (
      <CardItem
        key={plant[id]}
        plant={plant}
        styles={styles}
        onPressItem={onPressItem}
      />
    ));

    // TODO: If 'myCards' is empty, put some text like "You have no saved plants, would you like to explore?"

    return (
      <Layout style={styles.container}>
        <ScrollView>
          {myCards}
        </ScrollView>
      </Layout>
    );
  }
}

MyPlantsList.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default MyPlantsList;
