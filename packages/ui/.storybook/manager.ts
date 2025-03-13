import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Odyssage UI',
    brandUrl: 'https://github.com/your-organization/odyssage',
    brandTarget: '_blank',
  },
});
