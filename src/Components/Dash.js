import React, {Component} from 'react';
import Nav from './Nav';
import Start from './Start';
import EditGroup from './EditGroup.js';
import {Grid, Row, Col} from './Grid';
import Button from 'react-bootstrap/Button';
import Box from './ForgetBox.js';
import Modal from 'react-modal';
import TimeSum from './TimeSum.js';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  margin-left: 20px;
`

const EditButton = styled.div`
  display: ${(props) => props.timerOn ? 'none' : 'inline'};
`

const Group = styled.div`
  width: 100%;
  height: 19px;
  display: ${(props) => props.timerOn ? ((props.g._id === props.startedGroup._id) ? 'inline-table' : 'none') : 'inline-table'};
`
Modal.setAppElement('#root')

class Dash extends Component {

  static getDerivedStateFromProps(props, state) {
    if (props.log !== state.log) {
      return { log: props.log };
    }
    return null;
  }
  constructor(props) {
    super(props)
    
    this.state = {
      timers: [],
      groups: [],
      editModalIsOpen: false,
      addModalIsOpen: false,
      startIsOpen: false,
      timeInMins: false,
      timerName: '',
      timerLengthMins: 3,
      timerLengthSecs: 0,
      groupName: '',
      groupToEdit: {},
      startedGroup: {},
    }
    this.addModal = this.addModal.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.startModal = this.startModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.howManyTimers = this.howManyTimers.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.groupLink = this.groupLink.bind(this);
    this.noGroups = this.noGroups.bind(this);
    this.theirOrIts = this.theirOrIts.bind(this);
  }
  componentDidMount() {
    // this was calling with old token so i turned it off
    // this.props.getTimers(JSON.parse(localStorage.the_main_app).token);
    // this.startModal(this.props.groups[1]);
    let prevGroups = this.props.groups;
    
    let addGroup = {
      box: [""],
      editOpen: false,
      hash: "newgroup",
      name: "New Group",
      timers: [
        {
          name: "New Timer",
          length: 900,
        }
      ],
      user: "current user"
    }
    prevGroups.push(addGroup);

    //this is for the new way to add groups
    //currently being overwritten when a timer is finished
    //make this add a group by passing into the group list the save group functionality fro the addGroup component
      //we can delete the addgroup component after this is working
    //make the Add button different than the Save button
    //and make the start button not show up for the New Group box

    this.setState({
      groups: prevGroups
    })

  }

  closeEditModal() {
    this.setState({
      editModalIsOpen: false
    })
  }

  closeModal() {
    this.props.getTimers();
    this.setState({
      addModalIsOpen: false,
      startIsOpen: false,
      timers: [],
      timerName: '',
      timerLengthMins: 3,
      timerLengthSecs: 0,
      groupName: ''
    });
    this.forceUpdate();
  }

  addModal() {
    this.setState({addModalIsOpen: true});
  }
  startModal(g) {
    this.props.editOff();
    this.props.resetColors();
    this.setState({
      startIsOpen: true, 
      startedGroup: g,
      editModalIsOpen: false
    });
  }

  stopTimer() {
    this.setState({
      startIsOpen: false,
      startedGroup: {}
    })
  }

  deleteGroup(group) {
    const token = JSON.parse(localStorage.the_main_app).token;

    fetch(`https://banana-crumble-42815.herokuapp.com/group?token=${token}&groupId=${group._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(json => {
      if (json.success) {
        this.setState({timers: [], groupName: ''})
        this.props.getTimers(token)
        this.closeModal()
      } else {
        this.setState({timerError: json.message, isLoading: false})
      }
    });
  }

  howManyTimers(group) {
    if(group.timers.length === 1) return ' ' +  group.timers.length + ' timer';
    return ' ' +  group.timers.length + ' timers';
  }

  theirOrIts(group) {
    if(group.timers.length === 1) return 'Its '
    return 'Their combined '
  }

  howLongTimers(timers) {
    let result = 0;
    for (var i = 0; i < timers.length; i++) {
      result += timers[i].length;
    }
    return this.props.timeFormat(result, 'str');
  }

  groupLink(hash) {
    return `https://banana-crumble-42815.herokuapp.com/hash/${hash}`;
  }

  noGroups() {
    if(this.props.groups.length === 0) {
      return (
        <div>
          <h2>Welcome to Group Timer</h2>
          <h4>Press the Add Group button above to create your first group.</h4>
        </div>
      )
    }
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }


  render() {
    return (
      <div>
        <Nav log={this.props.log} username={this.props.username} getTimers={this.props.getTimers} loggedOut={this.props.loggedOut}></Nav>
        <Grid>
            <Row>
            {this.noGroups()}
            <Col size={1.5}></Col>
            <Col size={3}>
              {this.props.groups.map(g => {
                return (
                  <Group className="group" key={g._id} g={g} timerOn={this.state.startIsOpen} startedGroup={this.state.startedGroup}>
                    <div className="groupNameParent">
                      <h3>{g.name}</h3>
                      <ButtonWrapper>
                        {/* dont display start button if its new timer box */}
                        {g.hash === 'newgroup' ? 
                          null
                          :
                          //show either start or
                          this.state.startIsOpen ?
                            <Button className="five-px-margin-right" onClick={this.stopTimer}>&#9632;</Button>
                            :
                            <Button className="five-px-margin-right" onClick={() => this.startModal(g)}>&#9658;</Button>
                        }

                        {/* downward unicode arrow is smaller than up, so i display the button rotated if edit menu opened */}
                        <EditButton timerOn={this.state.startIsOpen}>
                          {g.editOpen ? (
                            <Button onClick={() => this.props.editGroup(g)}>&#8963;</Button>
                          ) : (
                            <Button id="dropdown-basic-button" onClick={() => this.props.editGroup(g)}>&#8963;</Button>
                          )}
                        </EditButton>

                      </ButtonWrapper>
                    </div>
                    {g.editOpen === true ? (
                        <EditGroup
                        closeEditModal={this.closeEditModal}
                        group={g}
                        colors={this.props.colors}
                        getTimers={this.props.getTimers}
                        deleteGroup={this.deleteGroup}
                        timeFormat={this.props.timeFormat}
                        timers={this.state.timers}>
                        addGroup={this.state.addGroup}
                      </EditGroup>
                    ) :
                      g.hash === 'newgroup' ? <div>Use dropdown to add new Group</div> : (this.state.startIsOpen ? null : <TimeSum timers={g.timers}></TimeSum>)
                    }
                    {this.state.startIsOpen ? (
                      <div>
                        <Start colors={this.props.colors} timerStart={true} boxContents={g.box} userId={this.props.userId} getTimers={this.props.getTimers} closeModal={this.closeModal} timeFormat={this.props.timeFormat} group={g}></Start>
                        <Box boxContents={g.box} group={g}></Box>
                      </div>
                      ) : <div></div>}
                  </Group>
                )
              })}
            </Col>
            <Col size={1.5}></Col>
            </Row>
        </Grid>
      </div>
    )
  }

}

export default Dash;
