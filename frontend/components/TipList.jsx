import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import MockTips from './MockTips.json';
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
    this.setState({
      loaded: true,
      tipIDs: MockTips.map((x) => x.tipID),
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
