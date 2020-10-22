/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { Image } from 'react-native';
import {
  Button, Card, Icon, Layout, Text,
} from '@ui-kitten/components';

function CardItem(props) {
  const itemInfo = props;

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

  const saveIcon = () => (
    <Icon {...props} name={!saveEntry ? 'heart' : 'heart-outline'} />
  );

  const collectionIcon = () => (
    <Icon {...props} name="plus-outline" />
  );

  const renderItemHeader = (headerProps, info) => (
    <Layout {...headerProps}>
      <Text category="h6">
        {info}
      </Text>
    </Layout>
  );

  const renderItemFooter = (footerProps) => (
    <Layout {...footerProps} style={itemInfo.styles.cardFooter}>
      <Button
        style={itemInfo.styles.button}
        status="primary"
        appearance={!saveEntry ? 'filled' : 'outline'}
        accessoryLeft={saveIcon}
        onPress={toggleSaveEntry}
      />
      <Button
        style={itemInfo.styles.button}
        status="primary"
        appearance={!collectionEntry ? 'filled' : 'outline'}
        accessoryLeft={collectionIcon}
        onPress={toggleCollectionEntry}
      />
    </Layout>
  );

  return (
    <Card
      key={itemInfo.plant.plantID}
      style={itemInfo.styles.card}
      status="basic"
      header={(headerProps) => renderItemHeader(headerProps, itemInfo.plant.plantName)}
      footer={renderItemFooter}
      onPress={() => { itemInfo.onPressItem(itemInfo.plant); console.log('onpress item called here')}}
    >
      <Image
        source={{ uri: itemInfo.plant.image.sourceURL }}
        style={{ width: itemInfo.styles.image.width, height: itemInfo.styles.image.height }}
      />
    </Card>
  );
}

export default CardItem;
