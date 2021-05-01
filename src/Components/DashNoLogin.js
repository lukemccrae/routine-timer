import React, {useState, useEffect} from 'react';
import TimeSum from './TimeSum.js';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
import Box from './ForgetBox.js';
import {getFromStorage} from '../utils/storage';
import Start from './Start';
import {Grid, Row, Col} from './Grid';
import Slider from 'react-input-slider';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


const EditBox = styled.div`

`

const Group = styled.div`
  width: 100%;
  height: 19px;
  display: ${(props) => props.timerOn ? ((props.g._id === props.startedGroup._id) ? 'inline-table' : 'none') : 'inline-table'};
`

const SliderBox = styled.div`
  width: 30%;
  margin: 5px 0 0 0;
`

const TimerMinsDisplay = styled.div`
  margin: 5px 5px 0 10px;
`

const TimerInput = styled.input`
  display: inline;
  font-size: 15px;
  margin: 0px 5px 10px 5px;
  // background-color: #D3D3D3;
  width: 90%;
  max-width: 120px;
  min-width: 100px;
  outline: 0;
  border-width: 0 0 1px;
  border-color: ${(props) => props.colors[props.timers.indexOf(props.t)]};
`

const TimerInputNew = styled.input`
  display: inline;
  font-size: 15px;
  margin: 0px 5px 10px 5px;
  width: 90%;
  max-width: 120px;
  min-width: 100px;
  outline: 0;
  border-width: 0 0 1px;
`
const ButtonWrapper = styled.div`
  display: flex;
  margin-left: 20px;
`

const Divider = styled.div`
  border-top: 2px solid #D3D3D3;
  margin: 5px 0 10px 0;
`

function DashNoLogin(props) {
  const [groupName, setGroupName] = useState("");
  const [timerLengthMins, setTimerLengthMins] = useState(5);
  const [newTimerName, setNewTimerName] = useState("Task 2");
  const [newTimerLength, setNewTimerLength] = useState(15);
  const [showDetails, setShowDetails] = useState(false);
  const [startIsOpen, setStart] = useState(false);
  const [startedGroup, setStartedGroup] = useState({});

  const [group, setGroup] = useState({
    name: "",
    timers: [{
      name: "Task 1",
      length: 900,
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
    },
    {
      name: "Task 2",
      length: 900,
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
    },
    {
      name: "Task 3",
      length: 900,
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
    }
],
    hash: "newgroup",
    timerGoing: false,
    editOpen: true,
  });

  useEffect(() => {
    if(group.timers.length == 0) {
      setGroup(props.group);
      setGroupName(props.group.name)
      setNewTimerName('Task 4');
    }
    console.log(group)
  }, [])

  function closeModal() {
    props.getTimers();
    setStart(false);
  }

  function startModal(g) {
    props.resetColors();
    setStart(true);
    setStartedGroup(g);
  }

  function stopTimer() {
    setStart(false);
    setStartedGroup({});
  }

  function editTimerLength(x, timer) {
    const updatedGroup = cloneDeep(group)
    for (let i = 0; i < updatedGroup.timers.length; i++) {
      if(updatedGroup.timers[i].id === timer.id) {
        updatedGroup.timers[i].length = x * 60;
      }      
    }
    // setTimers(updatedTimers);
    setGroup(updatedGroup);
  }

  function onTextboxChangeNewTimerName(event) {
    setNewTimerName(event.target.value);
  }

  function onTextboxChangeTimerName(event, t) {
    const updatedGroup = cloneDeep(group)
    for (var i = 0; i < updatedGroup.timers.length; i++) {
      if(updatedGroup.timers[i].id === t.id) {
        updatedGroup.timers[i].name = event.target.value
      }
    }
    // setTimers(updatedTimers);
    setGroup(updatedGroup)
  }
  
  function delItem(item) {
      let timersAmt = parseInt(group.timers.length);
      let updatedGroup = group;

      function isTimer(element) {
        if(element.id === item.id) return element;
      }

      let index = group.timers.findIndex(isTimer);
      updatedGroup.timers.splice(index, 1);
      setGroup(updatedGroup);
      setNewTimerName('Task ' + timersAmt);
    }

    function addItem() {
      let updatedGroup = group;
      let timersAmt = parseInt(group.timers.length) + 2;
      
      let newTimer = {
        name: newTimerName,
        length: newTimerLength * 60,
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
      }


      if(updatedGroup.timers.length < 7) {
        updatedGroup.timers.push(newTimer);
        setNewTimerName(group.timers.length < 7 ? 'Task ' + timersAmt : '');
        setGroup(updatedGroup);
        setNewTimerLength('15');
      }
    }


    return (
      <div>
      {/* <Nav log={props.log} username={props.username} getTimers={props.getTimers} loggedOut={props.loggedOut}></Nav> */}
      <Grid>
          <Row>
          <Col size={1.5}></Col>
          <Col size={3}>
                <Group className="group" key={group._id} g={group} timerOn={startIsOpen} startedGroup={startedGroup}>
                  <div className="groupNameParent">
                    <h3>{group.name}</h3>
                    <ButtonWrapper>
                      {startIsOpen ?
                        <Button className="five-px-margin-right" onClick={stopTimer}>&#9632;</Button>
                        :
                        <Button className="five-px-margin-right" onClick={() => startModal(group)}>&#9658;</Button>}

                      {/* downward unicode arrow is smaller than up, so i display the button rotated if edit menu opened */}
                      {/* <EditButton timerOn={startIsOpen}>
                        {g.editOpen ? (
                          <Button onClick={() => props.editGroup(g)}>&#8963;</Button>
                        ) : (
                          <Button id="dropdown-basic-button" onClick={() => props.editGroup(g)}>&#8963;</Button>
                        )}
                      </EditButton> */}

                    </ButtonWrapper>
                    
                  </div>
                  {startIsOpen === false ? (
                    <EditBox>
            {group.timers.map(t => {
              return (
                <Row key={t.id}>
                    <button style={{display: group.timers.length < 2 ? "none" : "inline", marginBottom: "10px"}} onClick={()=>{delItem(t)}} type="button" className="close" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>

                  <Col size={.5}>
                    <TimerInput colors={props.colors} timers={group.timers} t={t} type="text" value={t.name} onChange={(e) => onTextboxChangeTimerName(e, t)}/>
                  </Col>
                  <TimerMinsDisplay><div fontSize={12}>{t.length / 60}</div></TimerMinsDisplay>
                  <Col size={.01}></Col>
                  <Col size={.5}>
                    
                  <SliderBox>
                    <Slider
                    axis="x"
                    xmax = {30}
                    x={t.length / 60}
                    onChange={({ x }) =>  editTimerLength(x, t)}
                    styles={{
                      active: {backgroundColor: props.colors[group.timers.indexOf(t)]}
                    }}
                    />
                  </SliderBox>
                  </Col>

                </Row>
              )
            })}
            <Divider></Divider>
            <Row>
              <Col size={1}>
                <TimeSum timers={group.timers}></TimeSum>
              </Col>
              <Col size={3}>
                <TimerInputNew style={{margin: '5px 0 0 0'}} type="text" placeholder={'name'} value={newTimerName} onChange={(e, t) => onTextboxChangeNewTimerName(e)}/>
                  <Col size={.1}></Col>
              </Col>
              <Col size={.5}>
                <Button style={{display: 'inline'}} disabled={group.timers.length >= 7 || props.timerStart} onClick={addItem}>Add</Button>
              </Col>
            </Row>
              <Divider></Divider>
              {showDetails === true ? 
              <div>
                <Box boxContents={props.group.box} group={props.group}></Box>
                <Divider></Divider>
              </div> : null}
              <Row style={{display: 'flex'}}>
              <Col size={2}>
              </Col>
              </Row>
        </EditBox>
                  ) :
                    <div></div>
                  }
                  {startIsOpen ? (
                    <div>
                      <Start colors={props.colors} timerStart={true} boxContents={group.box} userId={props.userId} getTimers={props.getTimers} closeModal={closeModal} timeFormat={props.timeFormat} group={group}></Start>
                    </div>
                    ) : <div></div>}
                </Group>
          </Col>
          <Col size={1.5}></Col>
          </Row>
      </Grid>
    </div>
    )

}

export default DashNoLogin;
