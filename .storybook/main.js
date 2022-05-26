module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-mock/register"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5",
  },
  "typescript": {
    "check": false,
    "reactDocgen": false
  },
}
