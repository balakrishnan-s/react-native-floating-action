import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
  TouchableOpacity
} from 'react-native';

import { getTouchableComponent } from './utils/touchable';

class FloatingActionItem extends Component {
  constructor(props) {
    super(props);

    this.animation = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      Animated.spring(this.animation, { toValue: nextProps.active ? 1 : 0 }).start();
    }
  }

  handleOnPress = () => {
    const { name, onPress } = this.props;

    onPress(name);
  };

  render() {
    const animatedActionContainerStyle = {
      marginBottom: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 10]
      })
    };

    return (
      <TouchableOpacity activeOpacity={1} style={styles.container} onPress={this.handleOnPress}>
        <Animated.View style={[styles.actionContainer, animatedActionContainerStyle]}>
          {this.props.icon}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

FloatingActionItem.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.any,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  text: PropTypes.string,
  elevation: PropTypes.number,
  textElevation: PropTypes.number,
  textBackground: PropTypes.string,
  textColor: PropTypes.string,
  onPress: PropTypes.func,
};

FloatingActionItem.defaultProps = {
  color: '#1253bc',
  elevation: 5,
  textColor: '#444444',
  textBackground: '#ffffff'
};

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    flex: 1,
    flexDirection: 'column'
  },
  actionContainer: {
    flex: 1,
  },
});

export default FloatingActionItem;
