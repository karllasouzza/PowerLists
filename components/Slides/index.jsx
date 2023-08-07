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
import ColorModeContext from "../../context/colorMode.jsx";

const Slides = ({ current_slide, nextSlide, prevSlide }) => {
  const { colorScheme, theme } = useContext(ColorModeContext);

  const slide_pages = [
    {
      styles: {
        background: theme.schemes[colorScheme].successContainer,
        check_background: theme.schemes[colorScheme].success,
        check_color: theme.schemes[colorScheme].success,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_1.png"),
        title: "Planeje seu dia",
        subtitle: "Comece marcando o incio de um ciclo de produtividade!",
      },
      check: false,
    },
    {
      styles: {
        background: theme.schemes[colorScheme].secondaryContainer,
        check_background: theme.schemes[colorScheme].secondary,
        check_color: theme.schemes[colorScheme].secondary,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_2.png"),
        title: "Não se sobrecarregue",
        subtitle: "Marque o fim da dependência exclusiva do seu cérebro!",
      },
      check: false,
    },
    {
      styles: {
        background: theme.schemes[colorScheme].errorContainer,
        check_background: theme.schemes[colorScheme].error,
        check_color: theme.schemes[colorScheme].error,
      },
      content: {
        img: require("../../assets/Images/Slides/Illustration_3.png"),
        title: "Lembre-se de tudo",
        subtitle: "Marque tudo o que lhe é importante, desde listas a senhas!",
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
        <Slide_title color={theme.schemes[colorScheme].onBackground}>
          {slide_pages[current_slide].content.title}
        </Slide_title>
        <Slide_subtitle color={theme.schemes[colorScheme].onSurface}>
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
                      theme.schemes[colorScheme].secondaryContainer
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
