/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../server';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 70,
    paddingVertical: 80,
  },
  card: {
    marginVertical: 5,
    maxWidth: 900,
  },
  button: {
    margin: 2,
  },
});

const renderItemHeader = (headerProps, info) => (
  <Layout {...headerProps}>
    <Text category="h6">
      {info}
    </Text>
  </Layout>
);

const renderItemFooter = (footerProps) => (
  <Text {...footerProps}>
    Like
  </Text>
);

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
      <Card
        key={plant[id]}
        style={styles.card}
        status="basic"
        header={(headerProps) => renderItemHeader(headerProps, plant.plantName)}
        footer={renderItemFooter}
        onPress={() => { onPressItem(plant); }}
      >
        <Image
          source={{ uri: plant.image.sourceURL }}
          style={{ width: 150, height: 150 }}
        />
      </Card>
    ));

    return (
      <Layout
        style={styles.container}
      >
        <ScrollView style={{ flex: 1 }}>
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
