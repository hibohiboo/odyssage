import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Odyssage UI',
    brandUrl: 'https://github.com/hibohiboo/odyssage/packages/ui',
    brandTarget: '_blank',
  },
});
