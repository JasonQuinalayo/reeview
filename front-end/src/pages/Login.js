/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Form, Message, Segment,
} from 'semantic-ui-react';
import { useFormik } from 'formik';
import { loginService } from '../services';
import { useStateValue, setUser } from '../state';

const Login = () => {
  const [, dispatch] = useStateValue();
  const [error, setError] = useState();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Required';
      } else if (values.username.length < 6) {
        errors.username = 'Username must be at least 5 characters';
      } else if (values.username.length > 100) {
        errors.username = 'Too long!';
      }

      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Password must be at least 3 characters';
      } else if (values.password.length > 100) {
        errors.password = 'Too long!';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const user = await loginService.login(values.username, values.password);
        dispatch(setUser(user));
      } catch (err) {
        setError(err.response.data.error);
      }
    },
  });
  return (
    <Container>
      {error && <Message color="red">{error}</Message>}
      <Segment>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field
            label="Username"
            control={Form.Input}
            {...formik.getFieldProps('username')}
            error={formik.touched.username && formik.errors.username && {
              content: formik.errors.username,
            }}
          />
          <Form.Field
            label="Password"
            control={Form.Input}
            type="password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password && {
              content: formik.errors.password,
            }}
          />
          <Form.Button type="submit" fluid>Login</Form.Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default Login;
