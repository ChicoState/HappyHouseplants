import React, { Component } from 'react';
import {
  ScrollView, Image, Text, StyleSheet,
} from 'react-native';
import {
  Input, Button, Card, Layout,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import * as eva from '@eva-design/eva';
import { SERVER_ADDR } from '../server';

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      error: null,
      searchString: '',
      Results: [],
      Alldata: [],
    };

    this.styles = StyleSheet.create({
      searchResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
      titleText: {
        fontWeight: 'bold',
      },
      card: {
        marginVertical: 10,
        maxWidth: 100,
        flex: 1,
        flexDirection: 'row',
      },
      container: {
        paddingHorizontal: 70, paddingVertical: 80,
      },
    });
    this.searchPress = this.searchPress.bind(this);
  }

  componentDidMount() {
    const listThis = this;
    fetch(`${SERVER_ADDR}/plants/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        listThis.setState({
          loaded: true,
          error: null,
          Alldata: data,
        });
      }, (error) => {
        console.log(`Failed to load plant search. Reason: ${error}`);
        listThis.setState({ visible: false, error });
      });
  }

  searchPress() {
    const { searchString, Alldata } = this.state;
    this.setState({
      Results:
      Alldata.filter(
        (x) => x.plantName.toLowerCase().includes(searchString.toLowerCase()),
      ),
    });
  }

  render() {
    const { loaded, error } = this.state;
    const { onPressItem } = this.props;
    if (error) {
      const errMsg = `Failed to load search.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Text>Loading search...</Text>);
    }
    const renderItemHeader = (headerProps, info) => (
      <Layout mapping={eva.mapping} theme={eva.light}>
        <Text category="h6">
          {info}
        </Text>
      </Layout>
    );

    const renderItemFooter = () => (
      <Text mapping={eva.mapping} theme={eva.light}>
        Add
      </Text>
    );
    const { Results } = this.state;
    const id = '_id';
    const myCards = Results.map((plant) => (
      <Card
        key={plant[id]}
        style={this.styles.searchResultsContainer}
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

      <Layout>
        <Layout>
          <Input
            placeholder="Enter your search terms"
            onChangeText={(text) => this.setState({ searchString: text })}
          />
          <Button onPress={() => this.searchPress()}>
            Search
          </Button>
        </Layout>
        <Layout style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {myCards}
          </ScrollView>
        </Layout>
      </Layout>
    );
  }
}

SearchBar.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default SearchBar;
