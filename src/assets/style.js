
import { makeStyles } from "@material-ui/core/styles";

const style = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    imgStyle: {
      height: "auto",
      width: "40%",
      margin: "auto",
    },
    error: {
      color: "red",
    },
  }));

  export default style;
