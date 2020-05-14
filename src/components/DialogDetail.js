import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

const DialogDetail = (props) => {
    return (
        <Dialog
          onClose={props.handleClose}
          aria-labelledby="customized-dialog-title"
          open={props.dialog.open}
        >
          <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
            {props.report.status.toUpperCase() +
              " " +
              props.report.animal.toUpperCase() +
              " (" +
              props.report.date.toLocaleDateString() +
              ") by " +
              props.report.firstname +
              " " +
              props.report.lastname.substring(0, 1) +
              "."}
          </DialogTitle>
          <DialogContent dividers>
            <img src={props.report.imageUrl} width="100%" height="auto" alt="pet" />
            <br />
            Name: {props.report.petName ? props.report.petName : "?"}
            <br />
            Age: {props.report.petAge ? props.report.petAge + " years old" : "?"}
            <br />
            Gender: {props.report.petGender ? props.report.petGender : "?"} <br />
            Breed: {props.report.petBreed ? props.report.petBreed : "?"}
            <br />
            Coat type: {props.report.petCoatType
              ? props.report.petCoatType + " hair"
              : "?"}{" "}
            <br />
            Coat color(s):{" "}
            {props.report.petCoatColor ? props.report.petCoatColor.toString() : "?"}
            <br />
            Eyes color: {props.report.petEyesColor ? props.report.petEyesColor : "?"}
            <br />
            Pet size: {props.report.petSize ? props.report.petSize : "?"}
            <br />
            Particular information:{" "}
            {props.report.petParticularInfo ? props.report.petParticularInfo : "-"} <br />
            Circonstances: {props.report.circonstances ? props.report.circonstances : "-"}
            <br />
            Location : {props.report.location}
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              autoFocus
              onClick={props.handleClose}
              color="primary"
              variant="contained"
              disabled
            >
              Contact
            </Button>
          </DialogActions>
        </Dialog>
      );
};

export default DialogDetail;
