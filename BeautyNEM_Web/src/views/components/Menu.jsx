import React from "react";
import { createUseStyles } from "react-jss";
import { Button, Container,Label } from "reactstrap";
import "@fontsource/dancing-script";
import LogoutIcon from '@mui/icons-material/Logout';

const useStyles = createUseStyles({
  container: {
    backgroundColor: "#FF9494",
    height: 50,
  },
  containerLogout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
    alignItems: "center",
    paddingRight: 50,
    height: 50,
  },
  buttonLogout: {
    backgroundColor: "#FF9494",
    color: "gray",
    border: 0,
    display: "flex",
    flexDirection: "row",
  },
  labelFullname: {
    color: "white",
    fontSize: 20,
  },
  containerFullname: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Menu = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Container className={classes.containerLogout}>
        <Container className={classes.containerFullname}>
          <Label className={classes.labelFullname}>{props.user} | </Label>
        </Container>
        <Button
          className={classes.buttonLogout}
          onClick={() => {
            props.Logout();
          }}
        >
          <LogoutIcon />
        </Button>
      </Container>
    </Container>
  );
};

export default Menu;