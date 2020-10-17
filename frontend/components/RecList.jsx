/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import MockRec from './MockRec.json';

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

//onPress={}
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
    };
  }

  componentDidMount() {
    // setState: changes the state/personal data storage
    this.setState({
      loaded: true,
      // plantIDs: MockRec.map((x) => x.plantID), returns anarrray of plant Ids
    });
  }

  render() {
    const myCards = MockRec.map((plant) => (
      <Card
        key={plant.plantID}
        style={styles.card}
        status="basic"
        header={(headerProps) => renderItemHeader(headerProps, plant.plantName)}
        footer={renderItemFooter}
      >
        <Image
          source={{ uri: plant.image.sourceURL }}
          style={{ width: 300, height: 300 }}
        />
      </Card>
    ));
    const { loaded, error } = this.state;
    if (error) {
      const errMsg = `Failed to load recommendations.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Text>Loading Recommendations...</Text>);
    }

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

export default RecList;

