import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import withMock from 'storybook-addon-mock';

import { TextField, Typography } from '@mui/material';
import { NextAuthDialog } from '..';
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
        Some custom fields
      </Typography>
      <TextField type="text" placeholder="Email" fullWidth />
      <TextField type="password" placeholder="Password" fullWidth />
    </>),
};

Custom.parameters = {
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