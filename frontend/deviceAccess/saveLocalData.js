import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, token) => {
  try {
    const jsonValue = JSON.stringify(token);
    await AsyncStorage.setItem(key, jsonValue);
    console.log('Key set');
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = { storeData };
