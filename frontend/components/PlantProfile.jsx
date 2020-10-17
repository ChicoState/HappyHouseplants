import {
  Text, Divider, Card, Spinner, ListItem, List,
} from '@ui-kitten/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image,
} from 'react-native';

const Profiles = require('./MockPlants.json');

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

  getHumanReadableData = (dataObj, title, msgFallback) => {
    if (dataObj) {
      let message;
      if (dataObj.comment) {
        message = dataObj.comment;
      } else if (msgFallback) {
        message = msgFallback(dataObj);
      }

      if (message) {
        return { title, message };
      }
    }

    return undefined;
  }

  getMaintenanceData() {
    const { plantData } = this.state;
    return this.getHumanReadableData(plantData.maintenance, 'Maintenance', (data) => {
      switch (data.level) {
        case 0:
          return 'This plant requires very little maintenance.';
        case 1:
          return 'This plant requires some frequent maintenance.';
        case 2:
          return 'This plant requires a lot of maintenance.';
        default:
          return undefined;
      }
    });
  }

  getLightingData() {
    const { plantData } = this.state;
    return this.getHumanReadableData(plantData.lighting, 'Lighting', (data) => {
      let amountStr;
      switch (data.level) {
        case 0:
          amountStr = 'This plant only needs a small amount of lighting.';
          break;
        case 1:
          amountStr = 'This plant needs a moderate amount of lighting.';
          break;
        case 2:
          amountStr = 'This plant needs a lot of lighting.';
          break;
        default:
          return undefined;
      }
      const directSunStr = plantData.lighting.directSunlight ? 'Direct sunlight is acceptable.' : 'Avoid direct sunlight.';
      return `${amountStr} ${directSunStr}`;
    });
  }

  getWaterData() {
    const { plantData } = this.state;
    return this.getHumanReadableData(plantData.watering, 'Watering', (data) => {
      if (data.frequency) {
        return `Water this plant every ${data.frequency.quantity} ${data.frequency.timeFrame}.`;
      }

      return undefined;
    });
  }

  getEnvironmentData() {
    const { plantData } = this.state;
    return this.getHumanReadableData(plantData.environment, 'Environment', (data) => {
      let humidWord;
      switch (data.humidity) {
        case 0:
          humidWord = 'low';
          break;
        case 1:
          humidWord = 'medium';
          break;
        case 2:
          humidWord = 'high';
          break;
        default:
          humidWord = undefined;
          break;
      }
      const humidStr = humidWord ? `Keep this plant in a ${humidWord} humidity environment.` : '';
      let temp = { min: data.temperature.min, max: data.temperature.max };
      const unit = 'Farenheit';// TODO: Let the user decide (or determine by system culture info/locale?)
      switch (unit) {
        case 'Farenheit':
          temp.min = Math.round((temp.min * 9) / 5 + 32);
          temp.max = Math.round((temp.max * 9) / 5 + 32);
          break;
        case 'Celcuis':
          // Data is originally in celcius, no need to convert
          break;
        default:
          // Unknown unit
          temp = undefined;
          break;
      }
      const tempStr = temp ? `The ideal temperature is between ${temp.min} and ${temp.max} degrees ${unit}.` : '';
      if (humidStr || tempStr) {
        return `${humidStr} ${tempStr}`;
      }
      return undefined;
    });
  }

  getToxicityData() {
    const { plantData } = this.state;
    return this.getHumanReadableData(plantData.toxicity, 'Toxicity', (data) => {
      const { harmfulTo } = data;
      if (harmfulTo) {
        if (harmfulTo.length === 0) {
          return 'This plant is not known to be harmful to any pets.';
        }
        if (harmfulTo.length === 1) {
          return `This plant is toxic to ${harmfulTo[0]}.`;
        }
        if (harmfulTo.length === 2) {
          return `This plant is toxic to ${harmfulTo[0]} and ${harmfulTo[1]}.`;
        }

        const mutableHarmfulClone = harmfulTo.slice();
        const last = mutableHarmfulClone.pop();
        const commaStr = mutableHarmfulClone.join(', ');
        return `This plant is toxic to ${commaStr}, and ${last}.`;
      }
      return undefined;
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

    const dataRaw = [
      this.getMaintenanceData(),
      this.getLightingData(),
      this.getWaterData(),
      this.getEnvironmentData(),
      this.getToxicityData(),
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
            source={{ uri: plantData.image.sourceURL }}
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
