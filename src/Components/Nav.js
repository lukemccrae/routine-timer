import React, {Component} from 'react';
import Logout from './Logout';
import Stats from './Stats';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-modal';
import styled from 'styled-components';

const Username = styled.div`
  right: 14%;
  position: absolute;
`
const Dropdown = styled.div`
  right: 10%;
  position: absolute;
`

const ButtonBox = styled.div`
  margin: auto;
`

const Brand = styled.div`
  left: 10%;
  padding: 10px;
  position: absolute;
`

const AddGroup = styled.div`
  position: absolute;
  left: 50%;
`

const NavContainer = styled.div`
  padding: 10px;
  border-bottom: 1px solid grey;
`

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '50%'
  }
};

class Nav extends Component {
  constructor(props) {
    super(props)
    console.log(props);
    


    this.state = {
      modalIsOpen: false,
      statsModalIsOpen: false

    }

    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openStatsModal = this.openStatsModal.bind(this);
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = 'black';
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      statsModalIsOpen: false,
      timers: []
    });
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  openStatsModal() {
    this.setState({statsModalIsOpen: true});
  }

  render() {
    return (
      <NavContainer>
        <Navbar>
          <Brand>
            <Navbar.Brand href="/">GroupTimer</Navbar.Brand>
            {/* <div>Group Timer</div> */}
          </Brand>
          <ButtonBox>
            <Button onClick={this.props.addModal}>Add Group</Button>
          </ButtonBox>
          <Username>{this.props.username}</Username>
          <Dropdown>
            <NavDropdown title="" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.openModal}>About</NavDropdown.Item>
              <NavDropdown.Item onClick={this.openStatsModal}>Stats</NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/lukemccrae/routine-timer">Github</NavDropdown.Item>
              <NavDropdown.Divider/>
              <NavDropdown.Item>
                <Logout loggedOut={this.props.loggedOut} token={this.props.token}></Logout>
              </NavDropdown.Item>
            </NavDropdown>
          </Dropdown>
        </Navbar>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Welcome to Group Timer</h2>
          <h4>I created Group Timer to streamline my daily routines. The idea came after I found success practicing Hal Elrod’s <a href="https://halelrod.com/6-minute-miracle-morning/">Six Minute Miracle Morning</a>. I often find that the key to having a productive day is establishing microroutines for the essentials of daily life. I hope this tool can help you establish a deeper connection to the meaningful activities of your life. </h4>
        </Modal>
        <Modal
          isOpen={this.state.statsModalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>Stats</h2>
          <Stats getTimers={this.props.getTimers} log={this.props.log}></Stats>
        </Modal>
      </NavContainer>
    )
  }

}

export default Nav;
