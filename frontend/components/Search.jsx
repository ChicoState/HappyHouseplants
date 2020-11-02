import React, { Component } from 'react';
import {
  ScrollView, Text, StyleSheet,
} from 'react-native';
import {
  Input, Button, Layout, Select, SelectItem, IndexPath, SelectGroup,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../server';
import CardItem from './CardItem';

const styles = StyleSheet.create({
  searchResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    fontWeight: 'bold',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    maxWidth: 300,
    flex: 1,
  },
  container: {
    paddingHorizontal: 70, paddingVertical: 80,
  },
  image: {
    width: 150,
    height: 150,
  },
});

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      error: null,
      searchString: '',
      Results: [],
      Alldata: [],
      Filter: new IndexPath(0),
    };

    this.searchPress = this.searchPress.bind(this);
    this.setSelectedIndex = this.setSelectedIndex.bind(this);
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

  setSelectedIndex() {
    const { Filter, Alldata } = this.state;
    console.log(Filter);
    if (Filter.section === 1) {
      if (Filter.row === 0) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.maintenance.level.toString().includes('1'),
        ),
        });
      } else if (Filter.row === 1) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.maintenance.level.toString().includes('2'),
        ),
        });
      } else if (Filter.row === 2) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.maintenance.level.toString().includes('3'),
        ),
        });
      }
    } else if (Filter.section === 2) {
      if (Filter.row === 0) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.lighting.level.toString().includes('1'),
        ),
        });
      } else if (Filter.row === 1) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.lighting.level.toString().includes('2'),
        ),
        });
      } else if (Filter.row === 2) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => x.lighting.level.toString().includes('3'),
        ),
        });
      }
    } else if (Filter.section === 3) {
      if (Filter.row === 0) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => {
            if (x.environment.humidity !== null) {
              return x.environment.humidity.toString().includes('1');
            }
            return null;
          },
        ),
        });
      } else if (Filter.row === 1) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => {
            if (x.environment.humidity !== null) {
              return x.environment.humidity.toString().includes('2');
            }
            return null;
          },
        ),
        });
      } else if (Filter.row === 2) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => {
            if (x.environment.humidity !== null) {
              return x.environment.humidity.toString().includes('3');
            }
            return null;
          },
        ),
        });
      }
    } else if (Filter.section === 4) {
      if (Filter.row === 0) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => {
            if (x.environment.indoor !== null) {
              return x.environment.indoor.toString().includes('true');
            }
            return null;
          },
        ),
        });
      } else if (Filter.row === 1) {
        this.setState({
          Results:
        Alldata.filter(
          (x) => {
            if (x.environment.outdoor !== null) {
              return x.environment.outdoor.toString().includes('true');
            }
            return null;
          },
        ),
        });
      }
    }
  }

  searchPress() {
    const { searchString, Alldata, Filter } = this.state;
    if (Filter.section === undefined) {
      this.setState({
        Results:
        Alldata.filter(
          (x) => x.plantName.toLowerCase().includes(searchString.toLowerCase()),
        ),
      });
    }
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
    const { Results, selectedIndex } = this.state;
    const id = '_id';
    const myCards = Results.map((plant) => (
      <CardItem key={plant[id]} plant={plant} styles={styles} onPressItem={onPressItem} />
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
          <Select
            placeholder="Filter"
            selectedIndex={selectedIndex}
            onSelect={(index) => this.setState({ Filter: index },
              () => this.setSelectedIndex())}
          >
            <SelectItem title="Plant Name" />
            <SelectGroup title="Maintenance">
              <SelectItem title="Easy" />
              <SelectItem title="Medium" />
              <SelectItem title="Hard" />
            </SelectGroup>
            <SelectGroup title="Lighting">
              <SelectItem title="Little" />
              <SelectItem title="Medium" />
              <SelectItem title="Alot" />
            </SelectGroup>
            <SelectGroup title="Humidity">
              <SelectItem title="Low" />
              <SelectItem title="Medium" />
              <SelectItem title="High" />
            </SelectGroup>
            <SelectGroup title="Indoor/Outdoor">
              <SelectItem title="Indoor" />
              <SelectItem title="Outdoor" />
            </SelectGroup>
            <SelectGroup title="Climate">
              <SelectItem title="Cold" />
              <SelectItem title="Warm" />
              <SelectItem title="Hot" />
            </SelectGroup>
          </Select>
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
