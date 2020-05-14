import React, {useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import {
  geocodeForward,
} from "../../functions/geoCoding";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import style from "../../assets/style";
import {db } from "../../firebaseConfig";
import { validationNext } from "../../functions/validation";
import * as yup from "yup";
import {FirebaseContext} from "../../firebaseConfig";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignUp = () => {
  const classes = style();
  const {user,auth} = React.useContext(FirebaseContext);

  let history = useHistory();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    country: "",
    city: "",
    address: "",
    zipcode: "",
    lat: 0,
    lng: 0,
    allowNotification: false,
  });
  const [errors, setErrors] = useState({ path: "", message: " " });
  const [snackBar, setSnackBar] = useState({
    message: "",
    open: false,
    severity: "",
  }); //snackBar State

  //open snackbar
  const showSnackbar = (newState) => {
    setSnackBar({ ...newState, open: true });
  };

  const handleClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

    //reset errors message
    setErrors({ path: "", message: " " });

  };

  const setCoordinates = (lat, lng, location) => {
    setUserInfo({...userInfo, lat: lat, lng : lng});
  }

  const handleTypedAddress = async (e) => {
    var address = userInfo.address+", "+userInfo.city+", "+userInfo.zipcode;

    await geocodeForward(
      address,
      setCoordinates,
      null,
      null
    );

  };

  const validationSchema = yup.object().shape({
    firstname: yup.string().required("Firstname is required").max(20),
    lastname: yup.string().required("Lastname is required").max(20),
    city: yup.string().required("City is required").max(30),
    address: yup.string().required("Address is required").max(40),
    zipcode: yup.string().required("Postal/Zip Code is required").max(10),
  });

  const handleSignUp = () => {
    //create user account
    auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(() => {
        let uidUser = auth.currentUser.uid;
        //save user info
        db.collection("users")
          .doc(uidUser)
          .set(userInfo)
          .then(() => {
            //message account saved + redirect to home page
            showSnackbar({
              severity: "success",
              message: "Your account have been successfully created",
            });
              //redirect after 2 seconds
            setTimeout(() => {
              history.push("/");
            }, 2000);
          })
          .catch(() => {
            //show error
            showSnackbar({
              severity: "warning",
              message: "Your account couldn't be saved. Try later.",
            });
          });
      })
      .catch((error) => setErrors({ path: "", message: error.message }));
  };

  return (
    <form>
      <Grid container>
        <Grid item xs={12}>
          <br />
          <Typography variant="h6" className={classes.title}>
            Create your account
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
          <Grid container direction="row" justify="space-between">
            <TextField
              label="Firstname"
              id="firstname"
              name="firstname"
              value={userInfo.firstname}
              variant="outlined"
              onChange={(e) => handleChange(e)}
              size="small"
              style={{ width: "45%" }}
            />
            <br />
            <TextField
              label="Lastname"
              id="lastname"
              name="lastname"
              value={userInfo.lastname}
              variant="outlined"
              onChange={(e) => handleChange(e)}
              size="small"
              style={{ width: "45%" }}
            />
          </Grid>
          <br />
          <TextField
            label="Street Address"
            id="address"
            name="address"
            value={userInfo.address}
            variant="outlined"
            onChange={(e) => handleChange(e)}
            onBlur={(e) => handleTypedAddress(e)}
            size="small"
            className={classes.fullWidthInputs}
          />
          <br />
          <Grid container direction="row" justify="space-between">
            <TextField
              label="City"
              id="city"
              name="city"
              value={userInfo.city}
              variant="outlined"
              size="small"
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleTypedAddress(e)}
              style={{ width: "55%" }}
            />
            <br />
            <TextField
              label="Postal/Zip Code"
              id="zipcode"
              name="zipcode"
              value={userInfo.zipcode}
              variant="outlined"
              size="small"
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleTypedAddress(e)}
              style={{ width: "35%" }}
            />
          </Grid>
          <br />
          <TextField
            label="Email"
            id="email"
            name="email"
            value={userInfo.email}
            variant="outlined"
            size="small"
            onChange={(e) => handleChange(e)}
            className={classes.fullWidthInputs}
          />
          <br />
          <TextField
            label="Password"
            id="password"
            type="password"
            name="password"
            value={userInfo.password}
            variant="outlined"
            size="small"
            onChange={(e) => handleChange(e)}
            className={classes.fullWidthInputs}
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                disabled
                checked={userInfo.allowNotification}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, allowNotification: e.target.checked })
                }
                color="primary"
              />
            }
            label="I agree to receive notifications when a new report in my area is posted. (NOT DEVELOPPED YET)"
          />
          <br />
          {errors.message && (
            <div className={classes.error}>{errors.message}</div>
          )}
          <Button
            onClick={() =>
              validationNext(validationSchema, userInfo, handleSignUp, setErrors)
            }
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Sign up
          </Button>
          <Button
            className={classes.button}
            onClick={() => history.push("/signIn")}
          >
            Already have an account? Login
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackBar.open}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert onClose={handleClose} severity={snackBar.severity}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default SignUp;
