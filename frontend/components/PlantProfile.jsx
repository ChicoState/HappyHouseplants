import {
  Text, Divider, Card, Spinner, ListItem, List,
} from '@ui-kitten/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image,
} from 'react-native';

const Profiles = require('./MockRec.json');

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
    const { plantID } = this.props;
    this.setState({
      loaded: true,
      plantData: Profiles.find((x) => x.plantID === plantID),
    });
  }

  getLightingData() {
    const { plantData } = this.state;
    if (plantData.lightReq === ['low']) {
      return { title: 'Low lighting', message: 'This plant does not need very much lighting.' };
    }
    if (plantData.lightReq === ['medium']) {
      return { title: 'Medium lighting', message: 'This plant needs a medium amount of light, so put it in a bright area but avoid direct sunlight.' };
    }
    if (plantData.lightReq === ['high']) {
      return { title: 'High lighting', message: 'This plant needs a very bright environment, so consider putting it in a window or somewhere in direct sunlight.' };
    }
    if (plantData.lightReq === ['low', 'medium']) {
      return { title: 'Low to medium lighting', message: 'This plant can be placed in low to medium lighting, but avoid direct sunlight.' };
    }
    if (plantData.lightReq === ['medium', 'high']) {
      return { title: 'Medium to high lighting', message: 'This plant needs medium to high lighting, so put it in a bright area or near a window.' };
    }
    if (plantData.lightReq === ['low', 'medium', 'high']) {
      return { title: 'Any lighting', message: 'This plant does not care whether it gets a small amount of sunlight, or whether it is placed in direct sunlight.' };
    }
    return undefined;
  }

  getWaterData() {
    const { plantData } = this.state;
    if (plantData.waterFreq.comment) {
      return { title: 'Watering', message: plantData.waterFreq.comment };
    }
    // TODO: Maybe handle case where waterFreq.freq is defined but comment is undefined?
    return undefined;
  }

  getEnvironmentData() {
    const { plantData } = this.state;
    const climateStr = plantData.environ.climate.join(', ');
    let doorStr;
    switch (plantData.environ.doors) {
      case 'both':
        doorStr = 'indoor-outdoor';
        break;
      case 'in':
        doorStr = 'indoor';
        break;
      case 'out':
        doorStr = 'outdoor';
        break;
      default:
        return undefined;
    }

    return { title: 'Environment', message: `This ${doorStr} plant is best suited in a ${climateStr} environment.` };
  }

  getFertilizerData() {
    const { plantData } = this.state;
    const { quantity, timeFrame } = plantData.fertFreq;
    return { title: 'Fertilizer', message: `Replace the fertilizer every ${quantity} ${timeFrame}.` };
  }

  getTempData() {
    const { plantData } = this.state;
    const { min, max } = plantData.tempReq.Farenheit;// TODO: Allow user to specify desired units?
    return { title: 'Temperature range', message: `This plant prefers an average temperature between ${min} and ${max} degrees farenheit.` };
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

    const dataRaw = [
      this.getLightingData(),
      this.getWaterData(),
      this.getEnvironmentData(),
      this.getFertilizerData(),
      this.getTempData(),
    ];

    const data = dataRaw.filter((x) => x !== undefined);

    const renderItem = ({ item }) => (
      <ListItem title={item.title} description={item.message} />
    );

    return (
      <View style={{ flex: 1, width: '90%', marginLeft: '5%' }}>
        <Text category="h1">{plantData.plantName}</Text>
        <View style={{ width: '100%', minHeight: 250 }}>
          <Image
            source={{ uri: plantData.sourceImage }}
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

PlantProfile.propTypes = {
  plantID: PropTypes.string.isRequired,
};

export default PlantProfile;
