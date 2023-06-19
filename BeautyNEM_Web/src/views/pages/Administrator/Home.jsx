import React from "react";
import { createUseStyles } from "react-jss";
import { Container } from "reactstrap";
import NotFoundImage from "../../../assets/image/noResultFound.png";
import "@fontsource/dancing-script";

const useStyles = createUseStyles({
  container: {
    
  },
  header: {
    fontSize: "50px",
    fontFamily: "Dancing Script",
    color: "#FF9494",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  image: {
    width: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const Home = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <h1 className={classes.header}>Đây là trang chủ</h1>
    </Container>
  );
};

export default Home;
