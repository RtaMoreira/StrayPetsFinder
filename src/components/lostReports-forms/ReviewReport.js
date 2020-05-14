import React, {useState} from 'react';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import style from "../../assets/style";


const ReviewReport = (props) => {
    const [report] = useState(props.report);
    const classes =  style();


    return (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Please review your report before publishing</Typography>
          <div dividers>
            <img
              src={report.imageUrl}
              width="200px"
              height="auto"
              alt="animal"
            />
            <br />
            Name: {report.petName ? report.petName : "?"}
            <br />
            Age: {report.petAge ? report.petAge + " years old" : "?"}
            <br />
            Gender: {report.petGender ? report.petGender : "?"} <br />
            Breed: {report.petBreed ? report.petBreed : "?"}
            <br />
            Coat type: {report.petCoatType
              ? report.petCoatType + " hair"
              : "?"}{" "}
            <br />
            Coat color(s):{" "}
            {report.petCoatColor ? report.petCoatColor.toString() : "?"}
            <br />
            Eyes color: {report.petEyesColor ? report.petEyesColor : "?"}
            <br />
            Pet size: {report.petSize ? report.petSize : "?"}
            <br />
            Particular information:{" "}
            {report.petParticularInfo ? report.petParticularInfo : "-"} <br />
            Circonstances: {report.circonstances ? report.circonstances : "-"}
            <br />
            Location : {report.location}
          </div>
          <Button
            onClick={props.handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            className={classes.button}
            onClick={props.sendReport}
            variant="contained"
            color="primary"
          >
            {props.report.id? "Update my report": "Publish my report"}
          </Button>
        </Paper>
    );
};

export default ReviewReport;

