import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';
import { userService } from '../services';
import { useStateValue, setUser } from '../state';

const NavBar = () => {
  const [{ user }, dispatch] = useStateValue();
  return (
    <Menu pointing secondary>
      <Menu.Item>
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
      <Menu.Menu position="right">
        <Menu.Item>
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
      </Menu.Menu>
    </Menu>
  );
};

export default NavBar;
