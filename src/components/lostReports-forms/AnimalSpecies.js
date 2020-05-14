import React, {useState } from "react";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { validationNext } from "../../functions/validation";
import * as yup from "yup";
import style from "../../assets/style";

const AnimalSpecies = (props) => {
  const classes = style();
  const [errors, setErrors] = useState({ path: "", message: "" });

  const validationSchema = yup.object().shape({
    animal: yup.string().required("Species is required"),
  });
  return(
  <FormControl variant="filled" className={classes.formControl}>
    <InputLabel>Species</InputLabel>

    <Select
      id="animal"
      name="animal"
      value={props.report.animal}
      onChange={(e) => props.handleChange(e)}
      error={errors.path === "animal"}
    >
      {props.petOptions[3].species.map((species, key) => {
        return (
          <MenuItem value={species} key={key}>
            {species}
          </MenuItem>
        );
      })}
    </Select>
    {
      <div className={classes.error}>
        <br />
        <br />
        <p>{errors.message}</p>
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
          onClick={() =>
            validationNext(
              validationSchema,
              props.report,
              props.handleNext,
              setErrors
            )
          }
          className={classes.button}
        >
          Next
        </Button>
      </div>
    </div>
  </FormControl>);
};

export default AnimalSpecies;
