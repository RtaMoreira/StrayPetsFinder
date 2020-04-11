import React from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddLostReport from "./components/AddLostReport";
import ScreenMap from "./components/ScreenMap";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import theme from "./assets/AppTheme";
import { ThemeProvider } from '@material-ui/styles';


const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,

  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="sticky" >
          <Toolbar sp>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Typography variant="h6" className={classes.title}>
                Stray Pets Finder
              </Typography>
            </Link>
            <Link to="/addLostReport" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{ margin: "1em" }}
                disableElevation
              >
                Report lost pet
              </Button>
            </Link>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "1em" }}
              disabled
              disableElevation
            >
              Report found pet
            </Button>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path="/" component={ScreenMap} />
          <Route path="/addLostReport" component={AddLostReport} />
        </Switch>
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
