import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}


const theme = createTheme();

export const decorators = [
  (Story) => (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </>
  ),
];
