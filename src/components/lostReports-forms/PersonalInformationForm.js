import React, {useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { validationNext } from "../../functions/validation";
import * as yup from "yup";
import style from "../../assets/style";


const PersonalInformationForm = (props) => {
  const classes = style();
  const [errors, setErrors] = useState({ path: "", message: "" });

  const validationSchema = yup.object().shape({
    firstname: yup.string().required("Firstname is required").max(20),
    lastname: yup.string().required("Lastname is required").max(20),
    email: yup.string().email("Invalid email").required("Email is required"),
  });

    return (
      <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="Firstname"
            id="firstname"
            name="firstname"
            value={props.report.firstname}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            error={errors.path === "firstname"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Lastname"
            id="lastname"
            name="lastname"
            value={props.report.lastname}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            error={errors.path === "lastname"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Email"
            id="email"
            name="email"
            value={props.report.email}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            type="email"
            error={errors.path === "email"}
          />
        </Grid>
      </Grid>
      {
        <div className={classes.error}>
          <br />
          <br />
          {errors.message}
        </div>
      }
      <div className={classes.actionsContainer}>
        <div>
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() =>
              validationNext(
                validationSchema,
                props.report,
                props.handleNext,
                setErrors
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </form>
    );
};

export default PersonalInformationForm;
