import React from 'react';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import {
  Button, Layout,
} from '@ui-kitten/components';

const styles = StyleSheet.create({
  button: {
    margin: 3,
    width: 1,
    height: 3,
    flex: 0.5,
  },
});

function HeaderButtons(props) {
  const { labels, onLabelChanged, selectedLabel } = props;

  const buttons = labels.map((label) => (
    <Button
      key={label}
      style={styles.button}
      status="primary"
      appearance={label === selectedLabel ? 'filled' : 'outline'}
      onPress={() => {
        onLabelChanged(label);
      }}
    >
      {label}
    </Button>
  ));

  return (
    <Layout style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
    >
      {buttons}
    </Layout>

  );
}

HeaderButtons.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLabelChanged: PropTypes.func.isRequired,
  selectedLabel: PropTypes.string.isRequired,
};

export default HeaderButtons;
