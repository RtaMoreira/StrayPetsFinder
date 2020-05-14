import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { validationNext } from "../../functions/validation";
import * as yup from "yup";
import style from "../../assets/style";
import { dogBreeds, catBreeds, rabbitBreeds } from "../../assets/breeds"; //import breeds of each species
import Chip from "@material-ui/core/Chip";

const AnimalInfo = (props) => {
  //const classes = useStyles();

  const classes = style();

  //options state (initiated with "?" for all)
  const [coatType, setCoatType] = useState([{ coatType: "?" }]);
  const [coatColor, setCoatColor] = useState([{ coatColor: "?" }]);
  const [size, setSize] = useState([{ size: "?" }]);
  const [eyesColor, setEyesColor] = useState([{ eyesColor: "?" }]);
  //validation form
  const [errors, setErrors] = useState({ path: "", message: "" });
  const validationSchema = yup.object().shape({
    petName: yup.string().required("Your pet's name is required"),
    petAge: yup.string().required("Your pet's age is required"),
    petGender: yup.string().required("Your pet's gender is required"),
    petBreed: yup.string().required("Your pet's breed is required"),
    petCoatType: yup.string().required("Your pet's coat type is required"),
    petCoatColor: yup.string().required("Your pet's coat color is required"),
    petEyesColor: yup.string().required("Your pet's eyes color is required"),
    petSize: yup.string().required("Your pet's size is required"),
  });
  useEffect(() => {
    //format option for Autocomplete form
    const formatOptions = () => {
      props.petOptions[4].type.map((option) => {
        return setCoatType((coatType) => [...coatType, { coatType: option }]);
      });

      props.petOptions[0].color.map((option) => {
        return setCoatColor((coatColor) => [
          ...coatColor,
          { coatColor: option },
        ]);
      });

      props.petOptions[2].size.map((option) => {
        return setSize((size) => [...size, { size: option }]);
      });
      props.petOptions[1].color.map((option) => {
        return setEyesColor((eyesColor) => [
          ...eyesColor,
          { eyesColor: option },
        ]);
      });
    };
    formatOptions();
  }, [props.petOptions]);

  return (
    <form className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Your pet's name"
            value={props.report.petName}
            id="petName"
            name="petName"
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            required
            error={errors.path === "petName"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Your pet's age (in years)"
            value={props.report.petAge}
            name="petAge"
            id="petAge"
            onChange={(e) => props.handleChange(e)}
            type="number"
            inputProps={{ min: "1", step: "1" }}
            variant="filled"
            required
            error={errors.path === "petAge"}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Gender</InputLabel>
          <Select
            variant="filled"
            label="Gender"
            name="petGender"
            id="petGender"
            value={props.report.petGender}
            onChange={(e) => props.handleChange(e)}
            error={errors.path === "petGender"}
          >
            <MenuItem value="Male" key="Male">
              Male
            </MenuItem>
            <MenuItem value="Female" key="Female">
              Female
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Breed</InputLabel>
          <Autocomplete
            options={
              props.report.animal === "Dog"
                ? dogBreeds
                : props.report.animal === "Cat"
                ? catBreeds
                : rabbitBreeds
            }
            getOptionLabel={(option) => (option.breed ? option.breed : option)}
            style={{ width: 300, margin: "auto" }}
            value={props.report.petBreed}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Breed" />
            )}
            disableClearable
            openOnFocus
            error={errors.path === "petBreed"}
            id="petBreed"
            name="petBreed"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Pet size</InputLabel>
          <Autocomplete
            key={props.report.petSize}
            options={size}
            getOptionLabel={(option) => (option.size ? option.size : option)}
            style={{ width: 300, margin: "auto" }}
            value={props.report.petSize}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Pet size" />
            )}
            disableClearable
            openOnFocus
            error={errors.path === "petSize"}
            id="petSize"
            name="petSize"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Coat Type</InputLabel>
          <Autocomplete
            key={props.report.petCoatType}
            options={coatType}
            getOptionLabel={(option) =>
              option.coatType ? option.coatType : option
            }
            style={{ width: 300, margin: "auto" }}
            value={props.report.petCoatType}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Coat type" />
            )}
            disableClearable
            openOnFocus
            error={errors.path === "petCoatType"}
            id="petCoatType"
            name="petCoatType"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Coat color(s)</InputLabel>
          <Autocomplete
            multiple
            error={errors.path === "petCoatColor"}
            id="petCoatColor"
            name="petCoatColor"
            options={coatColor.map((color) => color.coatColor)}
            value={props.report.petCoatColor}
            style={{ width: 300, margin: "auto" }}
            freeSolo
            onChange={(e, values) => {
              //here e = undefined... idk
              props.handleChange("coatColor", values);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Coat color(s)" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Eyes color(s)</InputLabel>
          <Autocomplete
            multiple
            openOnFocus
            error={errors.path === "petEyesColor"}
            id="petEyesColor"
            name="petEyesColor"
            options={eyesColor.map((color) => color.eyesColor)}
            value={props.report.petEyesColor}
            style={{ width: 300, margin: "auto" }}
            freeSolo
            onChange={(e, values) => {
              //here e = undefined... idk
              props.handleChange("eyesColor", values);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Eyes color(s)" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Particular information</InputLabel>
          <TextField
            multiline
            rows="5"
            placeholder="add any particular information about your animal (collar, health problems, personality, etc.)"
            variant="filled"
            value={props.report.petParticularInfo}
            onChange={(e) => props.handleChange(e)}
            name="petParticularInfo"
            style={{ width: 300 }}
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
          <Button onClick={props.handleBack} className={classes.button}>
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
    </form>
  );
};

export default AnimalInfo;
