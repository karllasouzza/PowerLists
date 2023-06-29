import React, { useContext } from "react";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import Slides from "../../components/Slides";
import { Container_login } from "./styles";
import SlideContext, { SlideProvider } from "../../context/slidePage";

const Login = () => {
  return (
    <SlideProvider>
      <Container_login>
        <FocusAwareStatusBar />
      </Container_login>
    </SlideProvider>
  );
};
export default Login;
