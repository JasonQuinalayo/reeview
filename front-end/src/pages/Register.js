/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Container, Form, Message, Segment, Header,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
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
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Required';
      } else if (values.username.length < 6 || values.username.length > 24) {
        errors.username = 'Username must be at least 5 characters and at most 24 characters long';
      }

      if (!values.name) {
        errors.name = 'Required';
      } else if (values.name.length < 3) {
        errors.password = 'Name must be at least 3 characters and at most 24 characters long';
      }

      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Password must be at least 3 characters';
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
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password && {
              content: formik.errors.password,
            }}
          />
          <Form.Button type="submit">Register</Form.Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default Register;
