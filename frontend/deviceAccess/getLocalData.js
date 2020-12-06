import AsyncStorage from '@react-native-async-storage/async-storage';

async function getLocalData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously store
      console.log(`got data: ${value}`);
      return value;
    }
  } catch (error) {
    // error reading value
    console.log(`Error: ${error}`);
    return null;
  }
  return null;
}

module.exports = { getLocalData };
