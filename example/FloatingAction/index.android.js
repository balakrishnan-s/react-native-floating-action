import React, { Component } from 'react'; // eslint-disable-line
import {
  AppRegistry,
  StyleSheet,
  FlatList,
  Alert,
  Text,
  View,
  Image
} from 'react-native';

import FloatingAction from './component/FloatingAction';

class FloatingActionExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionButtonVisible: true
    };
  }

  offset = 0;

  handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    if (currentOffset <= 0) {
      this.setState({
        actionButtonVisible: true
      });

      return;
    }

    const direction = currentOffset > this.offset ? 'down' : 'up';
    this.offset = currentOffset;

    if (this.state.actionButtonVisible !== direction) {
      this.setState({
        actionButtonVisible: direction === 'up'
      });
    }
  };

  render() {
    const { actionButtonVisible } = this.state;

    const actions =[{
      name: "Accessibility",
      icon: (
        <View style={{
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{color: "#FFFFFF", marginRight: 20}}>Testing</Text>
          <View style={{
            width: 50,
            height: 50,
            backgroundColor: "#0000FF",
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image source={require('./images/ic_accessibility_white.png')}/>
          </View>
        </View>
      ),
      position: 1
    }]

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          data={
            [
              { key: 'row 1' }, { key: 'row 2' }, { key: 'row 3' },
              { key: 'row 4' }, { key: 'row 5' }, { key: 'row 6' },
              { key: 'row 7' }, { key: 'row 8' }, { key: 'row 9' },
              { key: 'row 10' }, { key: 'row 11' }, { key: 'row 12' },
              { key: 'row 13' }, { key: 'row 14' }, { key: 'row 15' },
              { key: 'row 16' }, { key: 'row 17' }, { key: 'row 18' },
              { key: 'row 19' }, { key: 'row 20' }, { key: 'row 21' }
            ]
          }
          renderItem={({ item }) => <Text style={styles.listRow}>{item.key}</Text>}
        />
        <FloatingAction
          actions={actions}
          visible={actionButtonVisible}
          mainButtonStyle={styles.mainButtonStyle}
          actionContainerStyle={styles.actionContainerStyle}
          onPressItem={
            (name) => {
              Alert.alert('Icon pressed', `the icon ${name} was pressed`);
            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  list: {
    flex: 1
  },
  listRow: {
    flex: 1,
    padding: 10,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0C0C0C'
  },
  example: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  mainButtonStyle: {
    position: "absolute",
    right: 15,
    bottom: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:  25,
    backgroundColor: "#FF0000"
  },
  actionContainerStyle: {
    position: "absolute",
    right: 15,
    bottom: 75,
    flexDirection: "column",
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius:  25,
  }
});

AppRegistry.registerComponent('FloatingAction', () => FloatingActionExample);
