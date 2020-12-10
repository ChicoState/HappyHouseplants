import * as React from 'react';
import { Layout } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import UserProfileView from './UserProfileView';

function UserProfileScreen(props) {
  const { navigation } = props;
  return (
    <Layout style={{ flex: 1 }}>
      <UserProfileView onLogout={() => navigation.navigate('Home')} />
    </Layout>
  );
}
UserProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default UserProfileScreen;
