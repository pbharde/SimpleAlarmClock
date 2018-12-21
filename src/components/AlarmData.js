import React, { Component } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Button } from 'react-bootstrap';
import { DatePicker } from 'antd';
import * as firebase from 'firebase';


class AlarmData extends Component {
  constructor(props){
    super(props)
      this.state={
        time:new Date(),
        alarmList:[],
        dateExists:false,
        initAlarm:false
    };
      this.onDateChange = this.onDateChange.bind(this);
      this.onTimeChange = this.onTimeChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
      //this.sound = new Audio(soundFile);
  }

  currentTime(){
    this.setState({
      time:new Date(),
      date:new Date()
    })
  }

  onDateChange(date, dateString) {
    let convetedDateFormat = moment(this.state.time.toLocaleDateString(), 'mm/dd/yyyy').format('YYYY-mm-DD');

      this.setState({
        saveDate: true,
        alarmDate:dateString
      })
  }

  onTimeChange(time, timeString) {
     this.setState({
      saveTime: true,
      alarmTime:timeString,
     })

}

handleSave() {
  let val = this.state.alarmTime;
          this.setState({saveTime: false});
          this.setState({saveDate: false});
          let currentTime = new Date();
         let selectedTime = new Date(this.state.alarmDate.concat(' ').concat(this.state.alarmTime));

           var dif = (selectedTime.getTime() - currentTime.getTime()) / 1000;
           if(dif<0){
             alert("Specified time is already pass1ed");
             return;
           }
           else{
             this.state.dbCon.orderByChild('alarmKey').equalTo(this.state.alarmDate.concat(this.state.alarmTime)).once('value').then(gotAlarms=>{
               var dateFound = gotAlarms.val();

                 if (dateFound){
                   alert("Specified alarm is already added")

               }
             else {
               var newAlarm = {
                 alarmKey:this.state.alarmDate.concat(this.state.alarmTime),
                 date:this.state.alarmDate,
                 time:this.state.alarmTime,
                 status:false
               }
               this.state.dbCon.push(newAlarm);

             }

             }

           );
           }

  }


  componentDidMount(){
  this.setState({
    dbCon : firebase.database().ref('/alarmclockdatabase')
  })
  }


  render() {
    return (
      <div className="App">

          <DatePicker onChange={this.onDateChange} /> &nbsp;
          <TimePicker onChange={this.onTimeChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> &nbsp;
          {this.state.saveTime && this.state.saveDate ?
           <Button bsStyle="danger" onClick = {this.handleSave}>Save</Button>
            :
           null
        }
      </div>
    );
  }
}

export default AlarmData;
