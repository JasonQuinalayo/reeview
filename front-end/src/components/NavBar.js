import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Container } from 'semantic-ui-react';
import { userService } from '../services';
import { useStateValue, setUser } from '../state';

const NavBar = () => {
  const [{ user }, dispatch] = useStateValue();
  return (
    <Menu fixed="top" inverted color="grey" pointing secondary>
      <Container>
        <Menu.Item id="navbar-first-item">
          <Link to="/home">
            REEview xd
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
        {user.isAdmin && (
        <Menu.Item>
          <Link to="/admin">
            Admin
          </Link>
        </Menu.Item>
        )}
        <Menu.Item id="navbar-last-item" position="right">
          <Button
            type="button"
            onClick={async () => {
              const response = await userService.logout();
              if (response.status === 204) {
                dispatch(setUser(null));
              } else {
                alert('Error logging out!');
              }
            }}
          >
            Logout
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
