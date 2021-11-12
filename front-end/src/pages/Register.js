/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Form, Message, Segment, Header, Divider, Button,
} from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { registerService } from '../services';
import { useStateValue, setUser } from '../state';

const Register = () => {
  const [, dispatch] = useStateValue();
  const [error, setError] = useState();
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Required';
      } else if (values.username.length < 6) {
        errors.username = 'Username must be at least 6 characters long';
      } else if (values.username.length > 100) {
        errors.username = 'Too long!';
      }

      if (!values.name) {
        errors.name = 'Required';
      } else if (values.name.length < 3) {
        errors.name = 'Name must be at least 3 characters';
      } else if (values.name.length > 32) {
        errors.name = 'Too long!';
      }

      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Password must be at least 3 characters';
      } else if (values.password.length > 100) {
        errors.password = 'Too long';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Required';
      } else if (values.confirmPassword.length < 3) {
        errors.confirmPassword = 'Password must be at least 3 characters';
      } else if (values.confirmPassword.length > 100) {
        errors.confirmPassword = 'Too long!';
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Passwords dont match';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const user = await registerService.register(
          values.username, values.name, values.password, id,
        );
        dispatch(setUser(user));
      } catch (err) {
        setError(err.response.data.error);
      }
    },
  });
  return (
    <Container>
      {error && <Message color="red">{error}</Message>}
      <Header>Register</Header>
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
            label="Name"
            control={Form.Input}
            type="text"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && formik.errors.name && {
              content: formik.errors.name,
            }}
          />
          <Form.Field
            label="Password"
            control={Form.Input}
            type="password"
            placeholder="Please don't forget your password ty"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password && {
              content: formik.errors.password,
            }}
          />
          <Form.Field
            label="Confirm Password"
            control={Form.Input}
            type="password"
            {...formik.getFieldProps('confirmPassword')}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword && {
              content: formik.errors.confirmPassword,
            }}
          />
          <Form.Button type="submit" fluid>Register</Form.Button>
        </Form>
        <Divider />
        <Link to="/">
          <Button fluid type="button">Login</Button>
        </Link>
      </Segment>
    </Container>
  );
};

export default Register;
