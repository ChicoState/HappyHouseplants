import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SERVER_ADDR } from '../../../server';
import FloatingTip from './FloatingTip';

class TipList extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      tipIDs: [],
      error: null,
    };
  }

  componentDidMount() {
    const listThis = this;
    fetch(`${SERVER_ADDR}/random_tips/`)
      .then((response) => response.json())
      .then((data) => {
        listThis.setState({
          loaded: true,
          tipIDs: data,
          error: null,
        });
      }, (err) => {
        console.log(`Failed to load tip list. Reason: ${err}`);
        listThis.setState({ visible: false, error: err });
      });
  }

  render() {
    const { loaded, tipIDs, error } = this.state;
    if (error) {
      const errMsg = `Failed to load tips.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Text>Loading tips...</Text>);
    }

    const tipViews = tipIDs.map((tipID) => (<FloatingTip key={tipID} tipID={tipID} />));
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {tipViews}
        </ScrollView>
      </View>
    );
  }
}

export default TipList;
