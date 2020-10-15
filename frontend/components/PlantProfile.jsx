import {
  Text, Divider, Card, Spinner, ListItem, List,
} from '@ui-kitten/components';
import React, { Component } from 'react';
import {
  View, Image,
} from 'react-native';

class PlantProfile extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      error: null,
      plantData: null,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
      plantData: {
        plantName: 'Fern Leaf Plumosus Asparagus Fern',
        plantSummary: 'I haven\'t yet Googled a summary for this plant.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Houseplants.JPG/1920px-Houseplants.JPG',
        sourceURL: 'https://www.gardeningknowhow.com/houseplants/chinese-evergreen/chinese-evergreen-plants.htm',
      },
    });
  }

  render() {
    const { loaded, error, plantData } = this.state;
    if (error) {
      const errMsg = `Failed to load plant data.\n${error}`;
      return (<Text>{errMsg}</Text>);
    }

    if (!loaded) {
      return (<Spinner />);
    }

    const data = [
      {
        title: 'Some Lighting',
        message: 'This plant needs only a small amount of light, so keep it indoors away from direct sunlight.',
      },
      {
        title: 'Low Maintenance',
        message: 'This plant does not require a lot of maintenance',
      },
      {
        title: 'Climate',
        message: 'This plant works best in temperatures between 60*F and 85*F, and does not require high humidity.',
      },
      {
        title: 'Watering',
        message: 'Water this plant approximately once per week, up to twice per week in higher temperatures.',
      },
    ];

    const renderItem = ({ item }) => (
      <ListItem title={item.title} description={item.message} />
    );

    return (
      <View style={{ flex: 1, width: '90%', marginLeft: '5%' }}>
        <Text category="h1">{plantData.plantName}</Text>
        <View style={{ width: '100%', minHeight: 250 }}>
          <Image
            source={{ uri: plantData.imageURL }}
            style={{
              width: null, height: null, flex: 1, resizeMode: 'contain',
            }}
          />
        </View>
        <Card>
          <Text>{plantData.plantSummary}</Text>
        </Card>
        <Divider />
        <List data={data} ItemSeparatorComponent={Divider} renderItem={renderItem} />
      </View>
    );
  }
}

export default PlantProfile;
