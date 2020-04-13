import React, { useState } from "react";
import { storage } from "../../firebaseConfig";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import * as yup from "yup";
import style from "../../assets/style";

const AnimalPicture = (props) => {
  const classes = style();
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(
    props.report.imageUrl === "no image" ? "" : props.report.imageUrl
  );
  //validation form
  const [errors, setErrors] = useState({ path: "", message: "" });
  const validationSchema = yup.object().shape({
    imgPreview: yup.string().required("An image of your pet is required"),
  });

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const fileSelected = e.target.files[0];
      console.log(e.target.files[0]);
      setImage(fileSelected); //save raw image object

      setImgPreview(URL.createObjectURL(fileSelected)); //save local url for preview
      console.log(imgPreview);

      //reset errors msg when image is picked
      setErrors({ path: "", message: "" });
    }
  };

  //image upload (with blob)
  const handleUpload = () => {
    console.log(image);
    const uploadTask = storage
      .ref("images")
      .child(props.report.email)
      .child(image.name)  
      .put(image); //raw image


    //monitoring of the upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {//progress function
      },
      (error) => {
        // error function
        console.log(error);
      },
      () => {
        // complete function
        //Retrieve download URL of the image stored in Firebase
        storage
          .ref("images")
          .child(props.report.email)
          .child(image.name)
          .getDownloadURL()
          .then((urlimage) => {
            console.log("url download", urlimage);
            props.handleImageUrl(urlimage); //save that URL
          });
      }
    );
  };

  //HandleClick : when click next : validate if image picked, upload it if not done before, go to next step
  const handleClick = async () => {
    await validationSchema
      .validate({ imgPreview: imgPreview })
      .then((result) => {
        if (
          (props.report.imageUrl === "no image" && imgPreview !== "") ||
          (props.report.imageUrl !== "no image" &&
            imgPreview !== props.report.imageUrl)
        )
          //if new img picked, got downloaded
          handleUpload();
        //next step
        props.handleNext();
      })
      .catch((err) => {
        console.log(err);
        setErrors(err);
      });
  };

  return (
    <div>
      <Grid container spacing={0} justifyContent="center">
        <Grid item xs={12}>
          <InputLabel>Pick an image</InputLabel>
        </Grid>
        <Grid item xs={12}>
          <input
            style={{ display: "none" }}
            accept="image/*"
            id="imageUrl"
            type="file"
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="imageUrl">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onChange={(e) => handleChange(e)}
            >
              Upload
            </Button>
          </label>
        </Grid>
        {imgPreview !== "" ? (
          <img
            src={imgPreview}
            alt="Uploaded images"
            className={classes.imgStyle}
          />
        ) : (
          ""
        )}
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
            onClick={() => handleClick()}
            className={classes.button}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimalPicture;
