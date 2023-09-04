import React, { useContext } from "react";
import {
  Slide_Checkboxes_Container,
  Slide_Text_View,
  Slide_image,
  Slide_subtitle,
  Slide_title,
  Slides_container,
} from "./styles.js";
import FocusAwareStatusBar from "../FocusAwareStatusBar.jsx";
import * as NavigationBar from "expo-navigation-bar";
import CheckBox from "../../assets/svgs/CheckBox.jsx";
import { useTheme } from "react-native-paper";

const Slides = ({ current_slide, nextSlide, prevSlide }) => {
  const theme = useTheme();

  const slide_pages = [
    {
      styles: {
        background: theme.colors.primaryContainer,
        check_background: theme.colors.primary,
        check_color: theme.colors.background,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_1.png"),
        title: "Planeje suas compras",
        subtitle: "Comece marcando o incio de um ciclo de produtividade!",
      },
      check: false,
    },
    {
      styles: {
        background: theme.colors.tertiaryContainer,
        check_background: theme.colors.tertiary,
        check_color: theme.colors.background,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_2.png"),
        title: "Evite anotações físicas",
        subtitle:
          "Marque o fim da dependência exclusiva de papel para anotar suas compras!",
      },
      check: false,
    },
    {
      styles: {
        background: theme.colors.errorContainer,
        check_background: theme.colors.error,
        check_color: theme.colors.background,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_3.png"),
        title: "Liste suas financias",
        subtitle: "Marque todas as suas financias em um único lugar!",
      },
      check: false,
    },
  ];

  NavigationBar.setBackgroundColorAsync(
    slide_pages[current_slide].styles.background
  );

  return (
    <Slides_container background={slide_pages[current_slide].styles.background}>
      <FocusAwareStatusBar
        color={slide_pages[current_slide].styles.background}
      />

      <Slide_image source={slide_pages[current_slide].content.img} />

      <Slide_Text_View>
        <Slide_title variant='headlineMedium' color={theme.colors.onBackground}>
          {slide_pages[current_slide].content.title}
        </Slide_title>
        <Slide_subtitle variant='titleMedium' color={theme.colors.onSurface}>
          {slide_pages[current_slide].content.subtitle}
        </Slide_subtitle>
      </Slide_Text_View>
      <Slide_Checkboxes_Container>
        {slide_pages
          .filter((slide, index) => index <= current_slide)
          .map((slide, index) => (
            <CheckBox
              key={index}
              check_color={slide.styles.check_color}
              check_background={slide.styles.check_background}
              background={slide.styles.check_background}
              checked={index < current_slide}
              next={() => {
                current_slide == 2
                  ? NavigationBar.setBackgroundColorAsync(
                      theme.colors.tertiaryContainer
                    )
                  : null;

                nextSlide();
              }}
              prev={() => {
                prevSlide();
              }}
            />
          ))}
      </Slide_Checkboxes_Container>
    </Slides_container>
  );
};

export default Slides;
