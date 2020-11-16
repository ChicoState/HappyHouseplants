import React from 'react';
import { Alert, Text, View } from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import { Select, SelectItem, Button } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import { SERVER_ADDR } from '../server';

const { authFetch } = require('../auth');

class AddMyPlantDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: ['Kitchen', 'Living room', 'Bedroom', 'Porch'], // TODO: Fetch from custom rooms
      locationIndex: 0,
    };
  }

  submit() {
    const { plant, onSubmit, onCancel } = this.props;
    const { locations, locationIndex } = this.state;

    if (locationIndex === -1) {
      throw Error('Cannot submit a plant in an undefined location. Assign locationIndex.');
    }

    authFetch(`${SERVER_ADDR}/myplants`, 'POST', {
      plantID: plant.plantID,
      location: locations[locationIndex - 1],
      image: plant.image, // TODO: Use custom image if provided
    }).then(() => {
      onSubmit();
    }).catch((error) => {
      Alert.alert(
        'Network Error',
        'Failed to add this plant',
        [
          { text: 'OK', onPress: onCancel },
        ],
      );
      console.error(`Failed to add a plant due to an error: ${error}`);
    });
  }

  render() {
    const { locationIndex, locations } = this.state;
    const { visible, plant, onCancel } = this.props;
    return (
      <View>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Title>{`Add ${plant.plantName}`}</Dialog.Title>
            <Dialog.Content>
              <Text>Location</Text>
              <Select
                placeholder="Select location..."
                value={locationIndex <= locations.length ? locations[locationIndex - 1] : 'Select location...'}
                selectedIndex={locationIndex}
                onSelect={(newIndex) => this.setState({ locationIndex: newIndex })}
              >
                { locations.map((loc) => (<SelectItem title={loc} key={loc} />)) }
                <SelectItem title="New Location..." />
              </Select>
              <Text />
              { /* TODO: Put 'custom image' form stuff here */ }
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => this.submit()}
                disabled={locationIndex < 1 || locationIndex > locations.length}
              >
                Add
              </Button>
              <Button onPress={() => onCancel()}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

AddMyPlantDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  plantName: PropTypes.string.isRequired,
  plantID: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddMyPlantDialog;
