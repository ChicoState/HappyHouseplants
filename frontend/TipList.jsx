import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
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
    fetch('https://raw.githubusercontent.com/ChicoState/HappyHouseplants/main/package.json')
      .then((response) => response.json())
      .catch((err) => {
        listThis.setState({ loaded: false, error: `${err}` });
      })
      .then((data) => {
        listThis.setState({ loaded: true, tipIDs: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'] });
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

    const tipViews = tipIDs.map((tipID) => (<FloatingTip key={tipID} />));
    return (
      <View style={{flex:1,}}>
      <ScrollView style={{flex:1,}}>
        {tipViews}
      </ScrollView>
      </View>
    );
  }
}

export default TipList;
