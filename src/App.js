import React, { Component } from 'react';
import './App.css';
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import AlarmData from './components/AlarmData';
import { Button } from 'react-bootstrap';
import * as firebase from 'firebase';
import AlarmList from './components/AlarmList';



var config = {
  apiKey: "AIzaSyDKX8hZg0c9_JOWw41qKK95Q_RJ71f-_9M",
  authDomain: "alarmclockdatabase.firebaseapp.com",
  databaseURL: "https://alarmclockdatabase.firebaseio.com",
  projectId: "alarmclockdatabase",
  storageBucket: "alarmclockdatabase.appspot.com",
  messagingSenderId: "738490981719"
};
firebase.initializeApp(config);


class App extends Component {
  constructor(props){
    super(props)
      this.state={time:new Date()}
       this.setAlarm = this.setAlarm.bind(this);
       this.onChange = this.onChange.bind(this);
  }

  setAlarm() {
      this.setState({data: true})
   }

  currentTime(){
    this.setState({
      time:new Date()
    })
  }

  onChange(time, timeString) {
}

  componentWillMount(){
      setInterval(()=>this.currentTime(),1000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h1 className="h1">Simple Alarm Clock</h1>
        <br></br>
          <p className="p">
            {this.state.time.toLocaleTimeString()}
          </p>
           <Button bsStyle="danger" onClick = {this.setAlarm}>Set Alarm</Button>
           {this.state.data ?
            <AlarmData /> :
            null
         }
         <AlarmList/>
          </header>
      </div>
    );
  }
}

export default App;
