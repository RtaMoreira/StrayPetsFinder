import React, {useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import style from "../../assets/style";
import {FirebaseContext} from "../../firebaseConfig";



const ScreenSignIn = () => {
  const {auth} = React.useContext(FirebaseContext);
    const[user,setUser]= useState({});
    const classes = style();
    let history = useHistory();
  

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };

    const handleLogin = () => {
       auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(() => history.push("/"))
      .catch(error =>setUser({ ...user, errorMessage: error.message }) );
    }
    return (
        <form>
        <Grid container>
          <Grid item xs={12}>
            <br />
            <Typography variant="h6" className={classes.title}>
              Log in
            </Typography>
            <br />
          </Grid>
  
          <Grid
            container
            xs={6}
            direction="column"
            style={{ margin: "auto" }}
            alignItems="center"
          >
            <TextField
              label="Email"
              id="email"
              name="email"
              value={user.email}
              variant="outlined"
              size="small"
              onChange={(e) => handleChange(e)}
            />
            <br />
            <TextField
              label="Password"
              id="password"
              type="password"
              name="password"
              value={user.password}
              variant="outlined"
              size="small"
              onChange={(e) => handleChange(e)}
            />
            <br />
            {user.errorMessage && (
              <div className={classes.error}>{user.errorMessage}</div>
            )}
            <Button
            onClick={() =>handleLogin()}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Log in
            </Button>
            <Button
              className={classes.button}
              onClick={() => history.push("/signUp")}
            >
              Don't have an account? Sign Up!
            </Button>
          </Grid>
        </Grid>
      </form>
    );
};

export default ScreenSignIn;