import React, {Component} from 'react';
import soundfile from '../Ding.mp3';
import Button from 'react-bootstrap/Button';
import Sound from 'react-sound';

class Completionist extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    

    this.state = {
      logging: false
    }
    this.next = this.next.bind(this);
  }
  // https://banana-crumble-42815.herokuapp.com/log
  next() {
    this.setState({logging: true})
    const token = JSON.parse(localStorage.the_main_app).token;
    fetch(`https://me5hvm8691.execute-api.us-west-2.amazonaws.com/default/logHandler`, {
      method: 'POST',
      body: JSON.stringify({
        name: this.props.currentTimer.name,
        timerLength: this.props.currentTimer.length,
        token: token,
        date: Date.now(),
        userId: this.props.userId
      })
    }).then(res => res.json()).then(json => {
      this.setState({logging: false})
      if (json.success) {
        this.props.refreshLog(json);
        this.props.nextTimer();
      } else {
        this.setState({timerError: json.message, isLoading: false})
      }
    });
  }

  render(props) {
    return (
      <div>
        <Button disabled={this.state.logging} onClick={this.next}>Next</Button>
        <Sound
          url={soundfile}
          playStatus={Sound.status.PLAYING}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying}
          loop={true}
          ignoreMobileRestrictions={true}
          volume={30}
      />
      </div>
    )
  }

}

export default Completionist;
