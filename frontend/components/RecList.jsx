/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Card, Icon, Layout, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { SERVER_ADDR } from '../server';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%' 
  },
  card: {
    marginVertical: 10,
    
  },
  cardFooter:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    margin: 3,
    width: 1,
    height:3,
    flex: .5,
  },
  image: {
    width: '80%', 
    height: 300
  }
});

const saveIcon = (props) => (
  <Icon {...props} name='heart'/>
  //<TouchableWithoutFeedback onPress={toggleSaveEntry}>
  //  <Icon {...props} name={!saveEntry ? 'heart' : 'heart-outline'}/>
  //</TouchableWithoutFeedback>
);

const collectionIcon = (props) => (
  <Icon {...props} name='plus-outline'/>

);

const renderItemHeader = (headerProps, info) => (
  <Layout {...headerProps}>
    <Text category="h6">
      {info}
    </Text>
  </Layout>
);

//onPress={() => { onPressItem(plant); }}
const renderItemFooter = (footerProps) => (
  <Layout {...footerProps} style = {styles.cardFooter}>

      <Button
            style={styles.button}
            status='basic'
            appearance='ghost'
            accessoryLeft={saveIcon}
      />
      <Button
            style={styles.button}
            status='basic'
            appearance='ghost'
            accessoryLeft={collectionIcon}
      />
  </Layout>
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
      
      //<cardItem plant={plant} styles={styles} onPressItem={onPressItem} />

      <Card
        key={plant[id]}
        style={styles.card}
        status="primary"
        header={(headerProps) => renderItemHeader(headerProps, plant.plantName)}
        footer={renderItemFooter}
        onPress={() => { onPressItem(plant); }}
      >
        <Image
          source={{ uri: plant.image.sourceURL }}
          style={ styles.image }
        />
      </Card>
    ));

    return (
      <Layout style={styles.container}>
        <ScrollView >
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
