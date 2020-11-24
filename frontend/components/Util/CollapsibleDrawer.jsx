/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Text } from 'react-native';
import { Button, Icon } from '@ui-kitten/components';
import Collapsible from 'react-native-collapsible';
import PropTypes from 'prop-types';

class CollapsibleDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { initiallyCollapsed } = props;
    this.state = {
      collapsed: initiallyCollapsed,
    };
  }

  render() {
    const { children, title } = this.props;
    const { collapsed } = this.state;

    const expandIcon = (props) => <Icon {...props} fill="#000000" name={collapsed ? 'arrow-ios-downward-outline' : 'arrow-ios-upward-outline'} />;

    return (
      <>
        <Button
          style={{
            width: '100%',
            backgroundColor: '#EEEEEE',
            borderRadius: 0,
            borderWidth: 0,
            borderBottomColor: '#CCCCCC',
            borderBottomWidth: 2,
          }}
          onPress={() => this.setState({ collapsed: !collapsed })}
          accessoryRight={expandIcon}
        >
          <Text style={{ color: '#000000' }}>{title}</Text>
        </Button>
        <Collapsible collapsed={collapsed}>
          {children}
        </Collapsible>
      </>
    );
  }
}

CollapsibleDrawer.propTypes = {
  initiallyCollapsed: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

CollapsibleDrawer.defaultProps = {
  initiallyCollapsed: false,
};

export default CollapsibleDrawer;
