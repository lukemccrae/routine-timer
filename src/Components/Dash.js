import React, {useState, useEffect} from 'react';
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

function Dash(props) {
  const [startIsOpen, setStart] = useState(false);
  const [startedGroup, setStartedGroup] = useState({});

  function closeModal() {
    props.getTimers();
    setStart(false);
  }

  function startModal(g) {
    setStartedGroup(g);
    props.resetColors();
    setStart(true);
    g.editOpen = false;
  }

  function stopTimer() {
    setStart(false);
    setStartedGroup({});
  }

  function deleteGroup(group) {
    const token = JSON.parse(localStorage.the_main_app).token;

    fetch(`https://banana-crumble-42815.herokuapp.com/group?token=${token}&groupId=${group._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(json => {
      if (json.success) {
        props.getTimers(token)
        closeModal()
      } else {
        console.log("error: ", json)
      }
    });
  }

  function noGroups() {
    if(props.groups.length === 0) {
      return (
        <div>
          <h2>Welcome to Group Timer</h2>
          <h4>Press the Add Group button above to create your first group.</h4>
        </div>
      )
    }
  }


    return (
      <div>
        {/* <Nav log={props.log} username={props.username} getTimers={props.getTimers} loggedOut={props.loggedOut}></Nav> */}
        <Grid>
            <Row>
            {noGroups()}
            <Col size={1.5}></Col>
            <Col size={3}>
              {console.log(props.groups)}
              {props.groups.map(g => {
                return (
                  <Group className="group" key={g._id} g={g} timerOn={startIsOpen} startedGroup={startedGroup}>
                    <div className="groupNameParent">
                      <h3>{g.name}</h3>
                      <ButtonWrapper>
                        {/* dont display start button if its new timer box */}
                        {g.hash === 'newgroup' ? 
                          null
                          :
                          //show either start or
                          startIsOpen ?
                            <Button className="five-px-margin-right" onClick={stopTimer}>&#9632;</Button>
                            :
                            <Button className="five-px-margin-right" onClick={() => startModal(g)}>&#9658;</Button>
                        }

                        {/* downward unicode arrow is smaller than up, so i display the button rotated if edit menu opened */}
                        <EditButton timerOn={startIsOpen}>
                          {g.editOpen ? (
                            <Button onClick={() => props.editGroup(g)}>&#8963;</Button>
                          ) : (
                            <Button id="dropdown-basic-button" onClick={() => props.editGroup(g)}>&#8963;</Button>
                          )}
                        </EditButton>

                      </ButtonWrapper>
                    </div>
                    {g.editOpen === true ? (
                        <EditGroup
                        group={g}
                        colors={props.colors}
                        getTimers={props.getTimers}
                        deleteGroup={deleteGroup}
                        timeFormat={props.timeFormat}
                        timers={g.timers}>
                      </EditGroup>
                    ) :
                      g.hash === 'newgroup' ? <div>Use dropdown to add new Group</div> : (startIsOpen ? null : <TimeSum timers={g.timers}></TimeSum>)
                    }
                    {startIsOpen ? (
                      <div>
                        <Start colors={props.colors} timerStart={true} boxContents={g.box} userId={props.userId} getTimers={props.getTimers} closeModal={closeModal} timeFormat={props.timeFormat} group={g}></Start>
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

export default Dash;
