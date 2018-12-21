import React, { Component } from 'react';
import * as firebase from 'firebase';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import soundFile from '../media/alarm.mp3';
import stopButton from '../media/button_cancel.png';
import deleteButton from '../media/deleteButton.png';

var divStyle={
  width: '30px'
}

class AlarmList extends Component {
  constructor(props){
    super(props)
    this.state={
      alarmList:[],
      dbCon : firebase.database().ref('/alarmclockdatabase'),
      isToggleOn: true,
      //isVisible:true
    };

    this.audio = new Audio(soundFile);

    this.pauseAlarm = this.pauseAlarm.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.playAlarm = this.playAlarm.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
  }

  deleteAlarm(key){
    this.audio.pause();
      return firebase.database().ref('/alarmclockdatabase/'+key).remove();
    }

    playAlarm(index){
     this.state.dbCon.orderByChild('alarmKey').equalTo(index).once('value').then(gotAlarms=>{
       var dateFound = gotAlarms.val();
       var key = Object.keys(dateFound);
       if(dateFound[key].status==false){
         this.audio.play();
         this.setState({
             isVisible: false
           })
       }
     })
    }

    pauseAlarm(index){
      this.state.dbCon.orderByChild('alarmKey').equalTo(index).once('value').then(gotAlarms=>{
        var dateFound = gotAlarms.val();
        var key = Object.keys(dateFound);
      firebase.database().ref('/alarmclockdatabase/'+key).update({
        status:true
      });
      this.audio.pause();

            this.setState({
                isVisible: true
              })
    })

    }

  handleClick() {
    this.setState(state => ({
          isToggleOn: !state.isToggleOn
        }));
}


  componentDidMount(){
    this.setState({play:true})
    this.state.dbCon.on('value',gotAlarms=>{
     this.getAlarms(gotAlarms.val());
   });
  }

  getAlarms(values){
    let alarmVal = values;
    let alarms = _(alarmVal)
                      .keys()
                      .map(alarmKey => {
                          let cloned = _.clone(alarmVal[alarmKey]);
                          cloned.key = alarmKey;
                          return cloned;
                      })
                      .value();
      this.setState({
        alarmList: alarms
      });
  }


  render() {
const isVisible = this.state.isVisible;
var compareDate = new Date();
var alarmSound = new Audio(soundFile);
    let alarmNodes = this.state.alarmList.map((alarm, index) => {

      return (
          <div key={alarm.alarmKey}>

            <span style={{textDecoration : isVisible  ? 'text-strike' : 'inherit'}}>{alarm.date}&nbsp;&nbsp;{alarm.time}</span> &nbsp;
                    &nbsp;

               {(new Date(alarm.date.concat(' ').concat(alarm.time)))<=new Date() ?
    <input type="image" src={stopButton} alt="stopButton"  style={divStyle} onClick={this.handleClick} id={alarm.alarmKey} value={this.state.value}>
     {this.state.isToggleOn ? this.playAlarm(alarm.alarmKey) : this.pauseAlarm(alarm.alarmKey)  }
  </input>
              :
             null
          }

&nbsp;&nbsp;
    <input type="image" src={deleteButton} alt="deleteButton"  style={divStyle} onClick={()=>this.deleteAlarm(alarm.key)} key={alarm.key}>
    </input>
          </div>
      )
    });

    return (
      <div className="App">
      <br></br>
        {this.state.dbCon.repo.dataUpdateCount!==0 ?
         <h1><font color="white">Alarms</font></h1>
          :
         null
      }
      {alarmNodes}
      </div>
    );
    }

}

export default AlarmList;
