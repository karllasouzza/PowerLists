import React from "react";

import theme from "../../assets/theme.json";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {
  ListContainer,
  ListHeader,
  ListHeaderSubtitle,
  ListHeaderTitle,
  ListItemsContainer,
} from "./styles";

export default () => {
  return (
    <ListContainer>
      <FocusAwareStatusBar color={theme.palettes.primary[95]} />
      <ListHeader>
        <ListHeaderTitle>{}</ListHeaderTitle>
        <ListHeaderSubtitle>Total: {} R$</ListHeaderSubtitle>
      </ListHeader>

      <ListItemsContainer></ListItemsContainer>
    </ListContainer>
  );
};
