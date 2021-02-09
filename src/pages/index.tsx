import * as React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Todos from '../components/Todos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
    },
    parent: {
      textAlign: "center",
    },
    heading: {
      marginTop: "80px",
      color: "black",
      letterSpacing: '3px'
    }
  })
);

const IndexPage = () => {
  const classes=useStyles();
  return (
    <div className={classes.parent}>
      <title>Todo App</title>
      <h1 className={classes.heading}>TODO LIST</h1>
      <Todos />
    </div>
  );
};

export default IndexPage;