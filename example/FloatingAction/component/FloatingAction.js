import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { sortBy, isNil } from 'lodash';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  Text
} from 'react-native';

import FloatingActionItem from './FloatingActionItem';

import { getTouchableComponent, getRippleProps } from './utils/touchable';

const DEVICE_WIDTH = Dimensions.get('window').width;

class FloatingAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      visible: props.visible
    };

    this.animation = new Animated.Value(0);
    this.actionsAnimation = new Animated.Value(0);
    this.visibleAnimation = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        Animated.spring(this.visibleAnimation, { toValue: 0 }).start();
      } if (!nextProps.visible) {
        Animated.spring(this.visibleAnimation, { toValue: 1 }).start();
      }
    }
  }

  getIcon = () => {
    const { actions, floatingIcon, overrideWithAction } = this.props;

    if (overrideWithAction) {
      const { icon } = actions[0];

      if (React.isValidElement(icon)) {
        return icon;
      }

      return <Image style={styles.buttonIcon} source={icon} />;
    }

    if (floatingIcon) {
      if (React.isValidElement(floatingIcon)) {
        return floatingIcon;
      }

      return <Image style={styles.buttonIcon} source={floatingIcon} />;
    }

    return <Image style={styles.buttonIcon} source={require('../images/add.png')} />;
  };

  handlePressItem = (itemName) => {
    const { onPressItem } = this.props;

    if (onPressItem) {
      onPressItem(itemName);
    }

    this.reset();
  };

  reset = () => {
    Animated.spring(this.animation, { toValue: 0 }).start();
    Animated.spring(this.actionsAnimation, { toValue: 0 }).start();

    this.setState({
      active: false
    });
  };

  animateButton = () => {
    const { overrideWithAction, actions, floatingIcon } = this.props;

    if (overrideWithAction) {
      this.handlePressItem(actions[0].name);

      return;
    }

    if (!this.state.active) {
      if (isNil(floatingIcon)) {
        Animated.spring(this.animation, { toValue: 1 }).start();
      }

      Animated.spring(this.actionsAnimation, { toValue: 1 }).start();

      // only execute it for the background to prevent extra calls
      LayoutAnimation.configureNext({
        duration: 180,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity
        }
      });

      this.setState({
        active: true
      });
    } else {
      this.reset();
    }
  };

  renderMainButton() {
    const {
      buttonColor,
      position,
      overrideWithAction,
    } = this.props;

    const animatedVisibleView = {
      transform: [{
        rotate: this.visibleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg']
        })
      }, {
        scale: this.visibleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0]
        })
      }]
    };

    let animatedViewStyle = {
      transform: [{
        rotate: this.animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg']
        })
      }]
    };

    if (overrideWithAction) {
      animatedViewStyle = {};
    }

    const Touchable = getTouchableComponent();

    return (
      <Animated.View
        style={[this.props.mainButtonStyle]}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            width: this.props.mainButtonStyle.width,
            height: this.props.mainButtonStyle.height,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          activeOpacity={1}
          onPress={this.animateButton}
        >
          <Animated.View style={[animatedViewStyle, {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }]}>
            {this.getIcon()}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderActions() {
    const {
      actions,
      position,
      overrideWithAction,
      actionsTextBackground,
      actionsTextColor,
      distanceToEdge,
    } = this.props;
    const { active } = this.state;

    if (overrideWithAction) {
      return null;
    }

    const animatedActionsStyle = {
      opacity: this.actionsAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      })
    };

    const actionsStyles = [animatedActionsStyle];

    if (this.state.active) {
      actionsStyles.push(styles[`${position}ActionsVisible`]);
    }

    return (
      <Animated.View style={[actionsStyles, this.props.actionContainerStyle]} pointerEvents="box-none">
        <View style={{
          
        }}>
          {
            sortBy(actions, ['position']).map(action => (
              <FloatingActionItem
                key={action.name}
                icon={action.icon}
                position={action.position}
                active={active}
                onPress={this.handlePressItem}
              />
            ))
          }
        </View>
      </Animated.View>
    );
  }

  renderTappableBackground() {
    const { overlayColor } = this.props;

    // TouchableOpacity don't require a child
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.overlay, { backgroundColor: overlayColor }]}
        onPress={this.reset}
      />
    );
  }

  render() {
    return (
      <Animated.View
        pointerEvents="box-none"
        style={[styles.overlay, { backgroundColor: 'transparent' }]}
      >
        {
          this.state.active &&
          this.renderTappableBackground()
        }
        <View style={[
          {
            flex: 1
          },
        ]}>
          {this.renderActions()}
          {this.renderMainButton()}
        </View>
      </Animated.View>
    );
  }
}

FloatingAction.propTypes = {
  visible: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.shape({
    buttonColor: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired
  })),
  actionsTextBackground: PropTypes.string,
  actionsTextColor: PropTypes.string,
  position: PropTypes.oneOf(['right', 'left', 'center']),
  buttonColor: PropTypes.string,
  overlayColor: PropTypes.string,
  floatingIcon: PropTypes.any,
  overrideWithAction: PropTypes.bool, // use the first action like main action
  onPressItem: PropTypes.func,
  distanceToEdge: PropTypes.number
};

FloatingAction.defaultProps = {
  overrideWithAction: false,
  visible: true,
  buttonColor: '#1253bc',
  overlayColor: 'rgba(68, 68, 68, 0.6)',
  position: 'right',
  distanceToEdge: 15
};

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    width: 56,
    zIndex: 10
  },
  rightActions: {
    alignItems: 'center',
  },
  leftActions: {
    alignItems: 'center',
  },
  centerActions: {
    left: -1000
  },
  rightActionsVisible: {
    // right: 0
  },
  leftActionsVisible: {
    // left: 0
  },
  centerActionsVisible: {
    left: (DEVICE_WIDTH / 2) - 30
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    elevation: 0,
    zIndex: 0
  },
  button: {
    zIndex: 3,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightButton: {},
  leftButton: {},
  centerButton: {
    left: (DEVICE_WIDTH / 2) - 28
  },
  buttonIcon: {
    resizeMode: 'contain'
  }
});

export default FloatingAction;
