/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { Image, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import {
  Button, Card, Icon, Layout, Text,
} from '@ui-kitten/components';

function CardItem(props) {
  const { plant, styles, onPressItem } = props;

  // console.log(`before style=${JSON.stringify(styles)}`);
  if (styles.image === undefined) {
    styles.image = CardItem.defaultProps.styles.image;
  }
  if (styles.cardFooter === undefined) {
    styles.cardFooter = CardItem.defaultProps.styles.cardFooter;
  }
  if (styles.button === undefined) {
    styles.button = CardItem.defaultProps.styles.button;
  }
  if (styles.card === undefined) {
    styles.card = CardItem.defaultProps.styles.card;
  }

  const [saveEntry, setSaveEntry] = useState(true);
  const [collectionEntry, setCollectionEntry] = useState(true);

  const toggleSaveEntry = () => {
    console.log('saveEntry status = ', saveEntry);
    setSaveEntry(!saveEntry);
    // need to remove or or add to from database
  };

  const toggleCollectionEntry = () => {
    console.log('collectionEntry status = ', collectionEntry);
    setCollectionEntry(!collectionEntry);
    // need to remove or or add to from database
  };

  const saveIcon = (info) => (
    <Icon {...info} name={!saveEntry ? 'heart' : 'heart-outline'} />
  );

  const collectionIcon = (info) => (
    <Icon {...info} name="plus-outline" />
  );

  const renderItemHeader = (headerProps, info) => (
    <Layout {...headerProps}>
      <Text category="h6">
        {info}
      </Text>
    </Layout>
  );

  const renderItemFooter = (footerProps) => (
    <Layout
      {...footerProps}
      style={styles.cardFooter}
    >
      <Button
        style={styles.button}
        status="primary"
        appearance={!saveEntry ? 'filled' : 'outline'}
        accessoryLeft={saveIcon}
        onPress={toggleSaveEntry}
      />
      <Button
        style={styles.button}
        status="primary"
        appearance={!collectionEntry ? 'filled' : 'outline'}
        accessoryLeft={collectionIcon}
        onPress={toggleCollectionEntry}
      />
    </Layout>
  );

  return (
    <Card
      key={plant.plantID}
      style={styles.card}
      status="success"
      header={(headerProps) => renderItemHeader(headerProps, plant.plantName)}
      footer={renderItemFooter}
      onPress={() => { onPressItem(plant); console.log('onpress item called here'); }}
    >
      <Image
        source={{ uri: plant.image.sourceURL }}
        style={styles.image}
      />
    </Card>
  );
}

CardItem.propTypes = {
  plant: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
  styles: PropTypes.objectOf(ViewPropTypes.style),
};

CardItem.defaultProps = {
  styles: {
    card: {
      marginVertical: 10,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      margin: 3,
      width: 1,
      height: 3,
      flex: 0.5,
    },
    image: {
      width: '80%',
      height: 300,
    },
  },
};

export default CardItem;
