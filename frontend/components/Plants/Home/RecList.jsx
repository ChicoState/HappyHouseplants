/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../../../server';
import CardItem from '../CardItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
});

class RecList extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      error: null,
      recList: [],
    };
  }

  componentDidMount() {
    const listThis = this;
    fetch(`${SERVER_ADDR}/plants/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        listThis.setState({
          loaded: true,
          recList: data,
          error: null,
        });
      }, (error) => {
        console.log(`Failed to load plant recommendations. Reason: ${error}`);
        listThis.setState({ visible: false, error });
      });
  }

  render() {
    const { loaded, error, recList } = this.state;
    const { onPressItem } = this.props;
    if (error) {
      const errMsg = `Failed to load recommendations.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Text>Loading Recommendations...</Text>);
    }

    const id = '_id'; // to prevent linter issues
    const myCards = recList.map((plant) => (

      <CardItem key={plant[id]} plant={plant} styles={styles} onPressItem={onPressItem} />

    ));

    return (
      <Layout style={styles.container}>
        <ScrollView>
          {myCards}
        </ScrollView>
      </Layout>
    );
  }
}

RecList.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default RecList;
