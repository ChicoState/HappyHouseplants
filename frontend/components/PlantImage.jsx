/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Image } from 'react-native';
import { Icon, Spinner } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const { authFetch } = require('../auth');

class PlantImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64: undefined,
      error: undefined,
    };
  }

  componentDidMount() {
    const { sourceURL, authenticationRequired } = this.props;
    if (authenticationRequired) {
      authFetch(sourceURL).then((res) => {
        this.setState({ base64: res });
      }).catch((error) => {
        console.error(`Failed to load a plant image: ${error}`);
        this.setState({ error });
      });
    }
  }

  render() {
    const { base64, error } = this.state;
    const { sourceURL, authenticationRequired } = this.props;

    if (error) {
      return (<Icon name="alert-triangle-outline" fill="red" />);
    }
    if (base64) {
      return (<Image {...this.props} source={{ uri: `data:image/jpeg;base64,${base64}` }} />);
    }
    if (!authenticationRequired) {
      return (<Image source={{ uri: sourceURL }} {...this.props} />);
    }

    return (<Spinner />);
  }
}

PlantImage.propTypes = {
  sourceURL: PropTypes.string.isRequired,
  authenticationRequired: PropTypes.bool,
};

PlantImage.defaultProps = {
  authenticationRequired: false,
};

export default PlantImage;
