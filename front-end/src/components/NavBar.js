import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

const NavBar = () => (
  <Menu pointing secondary>
    <Menu.Item>
      <Link to="/home">
        Home
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/profile">
        Profile
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/questions">
        Questions
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/practice-exam">
        Practice
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/group-exam">
        Group Exam
      </Link>
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item>
        <Button type="button">
          Logout
        </Button>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

export default NavBar;
