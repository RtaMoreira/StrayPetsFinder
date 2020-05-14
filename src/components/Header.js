import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {  useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import {FirebaseContext} from "../firebaseConfig";

const useStyles = makeStyles((theme) => ({
  removeLinkStyle: {
    textDecoration: "none",
  },
  title: {
    flexGrow: 1,
    color: "white",
    textDecoration: "none",
  },
}));

const Header = () => {
   const {user,auth} = React.useContext(FirebaseContext);
  const classes = useStyles();
  let history = useHistory();

  //logout action and redirect to login page
  const signOutUser = () => {
    auth.signOut();
    history.push("/");
  };

  return (
    <AppBar position="sticky">
      <Toolbar sp>
        <NavLink to="/" className={classes.removeLinkStyle}>
          <Typography variant="h6" className={classes.title}>
            Stray Pets Finder
          </Typography>
        </NavLink>
        <NavLink to="/addLostReport" className={classes.removeLinkStyle}>
          <Button
            variant="contained"
            color="secondary"
            style={{ margin: "1em" }}
            disableElevation
          >
            Report lost pet
          </Button>
        </NavLink>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "1em" }}
          disabled
          disableElevation
        >
          Report found pet
        </Button>
        {user ? (
          <div style={{marginLeft: "auto"}}>
            {" "}
            <NavLink to="/account" className={classes.removeLinkStyle}>
              <Button
                style={{ margin: "1em", color:"white" }}
                disableElevation
              >
                My Account
              </Button>
            </NavLink>
            <Button
              style={{ margin: "1em",color:"white" }}
              disableElevation
              onClick={() => signOutUser()}
            >
              Log Out
            </Button>
          </div>
        ) : (
          <NavLink to="/signIn" style={{marginLeft: "auto"}} className={classes.removeLinkStyle}>
            <Button
              style={{ margin: "1em", color:"white" }}
              disableElevation
            >
              Log In
            </Button>
          </NavLink>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
