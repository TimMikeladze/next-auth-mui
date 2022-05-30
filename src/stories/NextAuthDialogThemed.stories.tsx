import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import withMock from 'storybook-addon-mock';

import { createTheme, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';

import { NextAuthDialog } from '..';
import { defaultProviders } from './mocks';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: grey,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export default {
  title: 'NextAuthDialog - Custom Theme',
  component: NextAuthDialog,
  decorators: [withMock, (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  )],
  argTypes: {
  },
} as ComponentMeta<typeof NextAuthDialog>;

const Template: ComponentStory<typeof NextAuthDialog> = (args) => <NextAuthDialog {...args} />;

export const Default = Template.bind({});

Default.args = {
  open: true,
};

Default.parameters = {
  mockData: [
    defaultProviders,
  ],
};
