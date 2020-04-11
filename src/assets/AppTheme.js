import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#00897B',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#FFB74D',
    },
  },
});

export default theme;

