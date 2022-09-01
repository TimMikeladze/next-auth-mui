import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import withMock from 'storybook-addon-mock';

import { TextField, Typography } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { isValidEmail, NextAuthDialog } from '..';
import {
  allProviders, defaultProviders, emailProvider, getMockResponse, oauthProviders,
} from './mocks';

export default {
  title: 'NextAuthDialog',
  component: NextAuthDialog,
  decorators: [withMock],
  argTypes: {
  },
} as ComponentMeta<typeof NextAuthDialog>;

const Template: ComponentStory<typeof NextAuthDialog> = (args) => <NextAuthDialog {...args} />;

export const Default = Template.bind({});

Default.args = {
  open: true,
  disableSortByName: false,
};

Default.parameters = {
  mockData: [
    defaultProviders,
  ],
};

export const Loading = Template.bind({});

Loading.args = {
  open: true,
  loading: true,
};

export const Email = Template.bind({});

Email.args = {
  open: true,
};

Email.parameters = {
  mockData: [
    emailProvider,
  ],
};

export const Oauth = Template.bind({});

Oauth.args = {
  open: true,
};

Oauth.parameters = {
  mockData: [
    oauthProviders,
  ],
};

export const Custom = Template.bind({});

Custom.args = {
  open: true,
  children: (
    <>
      <Typography>
        Some custom fields at the top
      </Typography>
      <TextField type="text" placeholder="Email" fullWidth />
      <TextField type="password" placeholder="Password" fullWidth />
    </>),
  childrenBottom: (
    <Typography>
      Some custom fields at the bottom
    </Typography>
  ),
};

Custom.parameters = {
  mockData: [
    getMockResponse({}),
  ],
};

export const Error = Template.bind({});

Error.args = {
  open: true,
};

Error.parameters = {
  mockData: [{
    url: '/api/auth/providers',
    method: 'GET',
    status: 500,
    response: null,
  }],
};

export const CustomEmailSubmit = Template.bind({});

CustomEmailSubmit.args = {
  open: true,
  alwaysShowEmailField: true,
  EmailFieldProps: {
    helperText: 'A custom function will run on submission plus a custom validator to only allow @gmail.com emails.',
  },
  isValidEmail: (email) => isValidEmail(email) && email.endsWith('@gmail.com'),
  onSubmitEmail: async (email) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    action('onSubmitEmail')(email);
  },
};

CustomEmailSubmit.parameters = {
  mockData: [
    getMockResponse({}),
  ],
};

export const AllProviders = Template.bind({});

AllProviders.args = {
  open: true,
};

AllProviders.parameters = {
  mockData: [
    allProviders,
  ],
};
