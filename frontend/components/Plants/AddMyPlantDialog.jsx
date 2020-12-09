/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
  Alert,
  Text,
  View,
  Image,
} from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import {
  Select,
  SelectItem,
  Button,
  Spinner,
  Input,
  Layout,
  Icon,
} from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import Prompt from 'react-native-input-prompt';
import { PropTypes } from 'prop-types';

const { getMyPlantLocations, addToMyPlants } = require('../../api/myplants');

class AddMyPlantDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomLocationPrompt: false,
      locations: undefined, // Initialized from fetch
      locationIndex: 0,
      nickname: undefined,
      customImage: undefined,
      customImageMode: 'default',
      uploading: false,
    };

    this.updateLocations = this.updateLocations.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.requestDefaultImage = this.requestDefaultImage.bind(this);
    this.requestCameraImage = this.requestCameraImage.bind(this);
    this.requestGalleryImage = this.requestGalleryImage.bind(this);
    this.prevVisible = false;
  }

  componentDidMount() {
    this.updateLocations();
  }

  componentDidUpdate() {
    const { visible } = this.props;
    if (visible !== this.prevVisible) {
      this.updateLocations();
      this.nickname = undefined;
      this.prevVisible = visible;
    }
  }

  updateLocations() {
    const listDialog = this;
    getMyPlantLocations(true)
      .then((locations) => {
        listDialog.setState({
          locations,
        });
      })
      .catch((error) => {
        Alert.alert(
          'Network Error',
          'Failed to load plant location data',
          [
            { text: 'OK', onPress: listDialog.onCancel },
          ],
        );
        console.error(`Failed to find plant locations. Reason: ${error}`);
      });
  }

  submit() {
    const { plant, onSubmit, onCancel } = this.props;
    const {
      locations,
      locationIndex,
      nickname,
      customImage,
    } = this.state;

    const plantName = nickname ?? plant.name;

    const images = [];
    if (customImage) {
      images.push({
        base64: customImage,
      });
    }

    this.setState({ uploading: true });
    addToMyPlants(plant.plantID, plantName, locations[locationIndex - 1], images)
      .then(() => {
        // Reset state for future use
        this.setState({ locationIndex: 0, uploading: false });
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
        this.setState({ uploading: false });
      });
  }

  cancel() {
    const { onCancel } = this.props;
    this.setState({ locationIndex: 0 });
    onCancel();
  }

  requestDefaultImage() {
    this.setState({
      customImage: undefined,
      customImageMode: 'default',
    });
  }

  requestCameraImage() {
    ImagePicker.requestCameraPermissionsAsync().then((permissionResult) => {
      if (permissionResult.status !== 'granted') {
        Alert.alert('Sorry, you need to grant permissions before capturing a custom picture.');
      } else {
        ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
          base64: true,
        }).then((imageResult) => {
          if (!imageResult.cancelled) {
            this.setState({
              customImage: imageResult.base64,
              customImageMode: 'camera',
            });
          }
        }).catch((error) => {
          console.error(`Failed to select image from camera due to error: ${error}`);
        });
      }
    }).catch((error) => {
      console.error(`Failed to request permissions for camera due to error: ${error}`);
    });
  }

  requestGalleryImage() {
    ImagePicker.requestCameraRollPermissionsAsync().then((permissionResult) => {
      if (permissionResult.status !== 'granted') {
        Alert.alert('Sorry, you need to grant permissions before uploading a custom picture.');
      } else {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
          base64: true,
        }).then((imageResult) => {
          if (!imageResult.cancelled) {
            this.setState({
              customImage: imageResult.base64,
              customImageMode: 'gallery',
            });
          }
        }).catch((error) => {
          console.error(`Failed to select custom image from camera roll due to error: ${error}`);
        });
      }
    }).catch((error) => {
      console.error(`Failed to request permissions for camera roll due to error: ${error}`);
    });
  }

  render() {
    const {
      locationIndex,
      locations,
      showCustomLocationPrompt,
      customImage,
      customImageMode,
      uploading,
    } = this.state;
    const { visible, plant } = this.props;

    const locationSelection = locations !== undefined ? (
      <Select
        placeholder="Select location..."
        value={locationIndex <= locations.length ? locations[locationIndex - 1] : 'Select location...'}
        selectedIndex={locationIndex}
        onSelect={(newIndex) => {
          if (Number(newIndex) === locations.length + 1) {
            this.setState({ showCustomLocationPrompt: true });
          } else {
            this.setState({ locationIndex: newIndex });
          }
        }}
      >
        { locations.map((loc) => (<SelectItem title={loc} key={loc} />)) }
        <SelectItem title="New Location..." />
      </Select>
    ) : <Spinner />;

    const customLocationPrompt = (
      <Prompt
        visible={showCustomLocationPrompt}
        title="Enter the new location name"
        placeholder="ex: Bedroom"
        onCancel={() => this.setState({ showCustomLocationPrompt: false })}
        onSubmit={(loc) => {
          locations.push(loc);
          this.setState({
            locations,
            locationIndex: locations.length,
            showCustomLocationPrompt: false,
          });
        }}
      />
    );

    const clearIcon = (info) => (<Icon {...info} name={customImageMode === 'default' ? 'close-circle-outline' : 'close-circle'} />);
    const cameraIcon = (info) => (<Icon {...info} name={customImageMode === 'camera' ? 'camera-outline' : 'camera'} />);
    const galleryIcon = (info) => (<Icon {...info} name={customImageMode === 'gallery' ? 'image-outline' : 'image'} />);
    const pictureButtonStyle = { width: 25, height: 25, marginRight: '5%' };

    return (
      <View>
        <Portal>
          {customLocationPrompt}
          <Dialog visible={visible} onDismiss={() => this.cancel()}>
            <Dialog.Title>{`Add ${plant.name}`}</Dialog.Title>
            <Dialog.Content>
              <Text>Nickname (optional)</Text>
              <Input
                placeholder="ex: Window Jade"
                onChangeText={(newText) => this.setState({ nickname: newText })}
              />
              <Text />
              <Text>Location</Text>
              {locationSelection}
              <Text />
              <Text>Picture</Text>
              <Layout style={{ flexDirection: 'row' }}>
                <Button
                  style={pictureButtonStyle}
                  appearance={customImageMode === 'default' ? 'filled' : 'outline'}
                  accessoryLeft={clearIcon}
                  onPress={this.requestDefaultImage}
                />
                <Button
                  style={pictureButtonStyle}
                  appearance={customImageMode === 'camera' ? 'filled' : 'outline'}
                  accessoryLeft={cameraIcon}
                  onPress={this.requestCameraImage}
                />
                <Button
                  style={pictureButtonStyle}
                  appearance={customImageMode === 'gallery' ? 'filled' : 'outline'}
                  accessoryLeft={galleryIcon}
                  onPress={this.requestGalleryImage}
                />
              </Layout>
              <View style={{ maxWidth: '100%', height: 220, flex: 0 }}>
                <Image
                  source={{ uri: customImage ? `data:image/jpeg;base64,${customImage}` : plant.image.sourceURL }}
                  style={{ maxWidth: '100%', flex: 1 }}
                  resizeMode="cover"
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => this.submit()}
                disabled={locationIndex < 1 || locationIndex > locations.length}
                accessoryLeft={uploading ? () => (<Spinner />) : undefined}
                appearance={uploading ? 'outline' : 'filled'}
              >
                Add
              </Button>
              <Button
                onPress={() => this.cancel()}
                style={{ marginLeft: '5%' }}
              >
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

AddMyPlantDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  plant: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddMyPlantDialog;
