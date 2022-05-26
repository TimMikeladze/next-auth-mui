import React from 'react';
import { icons } from '../icons';

export const getMockResponse = (response: any) => ({
  url: '/api/auth/providers',
  method: 'GET',
  status: 200,
  response,
});

export const allProviders = getMockResponse(Object.keys({
  ...icons,
  email: {},
}).reduce((acc, key) => ({
  ...acc,
  [key]: {
    id: key,
    name: key,
    type: key === 'email' ? 'email' : 'oauth',
    hideProviderName: ['zoho', 'pipedrive'].includes(key),
  },
}), {}));

export const defaultProviders = getMockResponse({
  credentials: {
    id: 'credentials', name: 'credentials', type: 'credentials',
  },
  oauth: {
    id: 'oauth', name: 'Custom Provider', type: 'oauth', icon: <div style={{ marginBottom: 4 }}>🔑</div>,
  },
  email: {
    id: 'email', name: 'Email', type: 'email',
  },
  facebook: {
    id: 'facebook', name: 'Facebook', type: 'oauth',
  },
  github: {
    id: 'github', name: 'GitHub', type: 'oauth',
  },
  google: {
    id: 'google', name: 'Google', type: 'oauth',
  },
  twitter: {
    id: 'twitter', name: 'Twitter', type: 'oauth',
  },
  auth0: {
    id: 'auth0', name: 'Auth0', type: 'oauth',
  },
  slack: {
    id: 'slack', name: 'Slack', type: 'oauth',
  },
  reddit: {
    id: 'reddit', name: 'Reddit', type: 'oauth',
  },
});

export const oauthProviders = getMockResponse({
  facebook: {
    id: 'facebook', name: 'Facebook', type: 'oauth',
  },
  github: {
    id: 'github', name: 'GitHub', type: 'oauth',
  },
  google: {
    id: 'google', name: 'Google', type: 'oauth',
  },
  twitter: {
    id: 'twitter', name: 'Twitter', type: 'oauth',
  },
});

export const emailProvider = getMockResponse({
  email: {
    id: 'email', name: 'Email', type: 'oauth',
  },
});
