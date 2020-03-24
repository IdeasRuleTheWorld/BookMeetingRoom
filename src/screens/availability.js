/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Keyboard,
  button,
  Platform,
  Alert,
  Modal
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { objectExpression } from '@babel/types';
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from "native-base";

var BUTTONS = ["Capacity", "Availability"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      show: false,
      showDate: false,
      showTime: false,
      value: '',
      datevalue: moment(),
      timevalue: moment(),
      mode: 'date',
      label: 'Date',
      name: '',
      level: '',
      capacity: '',
      availability: [],
      rooms: [],
      hours: [],
      modalVisible: false,
      sortSelected: ''
    }
  }
   
  renderItem(data) {
    return(
      <TouchableOpacity>
        <View >
          <Text>{data.name}</Text>
          <Text>Level {data.level}</Text>
          <Text>{data.capacity} pax</Text>
        </View>
      </TouchableOpacity>
    ) 
  }

  async componentDidMount() {
    this.getMeetingRooms()
  }

  getMeetingRooms = () => {
    try {
      axios.get('https://gist.githubusercontent.com/yuhong90/7ff8d4ebad6f759fcc10cc6abdda85cf/raw/463627e7d2c7ac31070ef409d29ed3439f7406f6/room-availability.json').then((response) => {
        this.setState({ rooms : response.data })
      })
    } catch(err) {
      console.log("Error fetchning data", err)
    }
  }

  showDatePicker = value => {
     this.setState({ showDate: true });
     Keyboard.dismiss();
   };
  showTimePicker = () => {
    this.setState({ showTime: true });
    Keyboard.dismiss();
  };
  showDateTimePicker = value => {
    if(value == 'date')
      this.setState({ showDate: true });
    else
      this.setState({ showTime: true });
      Keyboard.dismiss();
  }
  handleDatePicked = value => {
    //this.setState({ value: value });
    this.setState({ datevalue: value });
    setTimeout(() => {
      this.hideDatePicker();
    }, 250);
  };
  handleTimePicked = value => {
    //this.setState({ value: value });
    this.setState({ timevalue: value });
    setTimeout(() => {
      this.hideTimePicker();
    }, 250);
  };
  hideDatePicker = () => {
    this.setState({ showDate: false });
  };
  hideTimePicker = () => {
    this.setState({ showTime: false });
  };

  sortByCapacity = () => {
    const sortCapacity = this.state.rooms
    .sort(function(a, b) {
      if(parseInt(a.capacity) < parseInt(b.capacity)) return -1;
      if(parseInt(a.capacity) > parseInt(b.capacity)) return 1;
        return 0;
      })
      this.setState({ rooms : sortCapacity}) 
  }

  sortByAvail = () => {
    //const tv = this.state.timevalue
    const availArr = Object.entries(this.state.rooms)
    const temparr = []
    availArr.forEach(([key, value]) => {
      if(key == 'availability') {
        temparr.push(value)
      }
    })
  }

  onValueChange(value: string) {
    this.setState({
      sortSelected: value
    });
    if(value == 'key1'){
      this.sortByCapacity()
    }
    if(value == 'key2'){
      this.sortByAvail()
    }
  }

  render() {
    const {label, value, datevalue, timevalue, show, showDate, showTime, mode, dateFormat,timeFormat , rooms} = this.state;
    const { navigate } = this.props.navigation
    const temparr = []
    return (
      <View>
        <SafeAreaView style={styles.SafeAreaView}>
          <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
            <View style={{flexDirection:'column'}}>
            <Text >Book a Room</Text>
            </View>
            <View style={{flexDirection:'column', alignSelf:'flex-end'}}>
              <Text style={{}} onPress={() => navigate("Scanner")}>Scan</Text>
            </View>
          </View>

          <View style={styles.spaceContainer}></View>
          <View><Text>Date</Text></View>
          <TextInput style={styles.textinput} value={datevalue ? moment(datevalue).format(dateFormat) : ''} onFocus={this.showDatePicker}/>
          <DateTimePicker
            date={value ? new Date(value) : new Date()}
            isVisible={showDate}
            mode="date"
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDatePicker}
          />

          <View style={styles.spaceContainer}></View>
          <View><Text>Timeslot</Text></View>
          <TextInput style={styles.textinput}  value={timevalue ? moment(timevalue).format(timeFormat) : ''} onFocus={this.showTimePicker}/>
          <DateTimePicker
            date={value ? new Date(value) : new Date()}
            isVisible={showTime}
            mode="time"
            onConfirm={this.handleTimePicked}
            onCancel={this.hideTimePicker}
          />

          <View style={styles.spaceContainer}></View>
          <View style={{flexDirection:'row',justifyContent : 'space-between'}}>
            <View style={{flexDirection:'column', alignSelf:'flex-start' }}>
              <Text >Rooms</Text>
            </View>
            <View>
              <Picker
                mode="dropdown"
                placeholder="Sort"
                style={styles.picker}
                selectedValue={this.state.sortSelected}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="Sort - Please select" value="key0" />
                <Picker.Item label="Capacity" value="key1" />
                <Picker.Item label="Availability" value="key2" />
              </Picker>
            </View>

          </View>
          <View style={styles.spaceContainer}></View>
          <ScrollView>
            <FlatList
              data={this.state.rooms}
              extraData={this.state}
              renderItem={({item}) => (
                <View style={styles.meetingRoom}>
                  <View style={styles.section}>
                    <Text style={styles.roomName}>{item.name}</Text>
                    <Text style={styles.roomLevel}>Level {item.level}</Text>
                  </View>
                  <View style={styles.section}>
                  <Text style={styles.roomAvail}>{ 
                    Object.entries(item.availability).map(([key, value]) => {
                      const tv = timevalue ? moment(timevalue).format(timeFormat) : ''
                      if(key == tv)
                        if(value == 0)
                          return <Text style={{color:'grey'}}>Not available</Text>
                        else
                          return <Text style={{color:'green'}}>Available</Text>
                    })
                  } </Text>
                  <Text style={styles.roomCapacity}>{item.capacity} pax</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.name} 
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  spaceContainer:{
    height:25
  },
  scrollView: {
    backgroundColor: Colors.lighter,
    marginBottom:20,
  },
  textinput: {
    padding:0, 
    margin:0,
    height:25, 
    borderBottomWidth:1, 
    borderBottomColor:'#dedede'
  },
  SafeAreaView: {
    marginVertical: 15,
    marginHorizontal: 15,
    marginBottom:30
  },
  meetingRoom:{
    backgroundColor:'#DEDEDE',
    marginBottom:10,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15
  },
  roomName: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: 18,
    fontWeight: '500'
  },
  roomLevel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  roomCapacity: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  roomAvail: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    fontStyle: "italic"
  },
  section: {
    flex: 1
  },
  title: {
    ...Platform.select({
      android: {
        flex:1
      },
    })
  },
  picker: {
    width: 100, 
    flexDirection:'column', 
    alignSelf:'flex-end', 
    padding:0, 
    margin:0, 
    paddingTop: 0, 
    paddingBottom:0,
    ...Platform.select({
      android: {
        height:10,
      },
    })
  }

});

