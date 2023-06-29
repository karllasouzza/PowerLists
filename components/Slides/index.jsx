import React, { useContext, useState } from "react";
import {
  Slide_Checkboxes_Container,
  Slide_Text_View,
  Slide_image,
  Slide_subtitle,
  Slide_title,
  Slides_container,
} from "./styles.js";
import FocusAwareStatusBar from "../FocusAwareStatusBar.jsx";
import theme from "../../assets/theme.json";
import * as NavigationBar from "expo-navigation-bar";
import CheckBox from "../../assets/svgs/CheckBox.jsx";

const Slides = ({ current_slide, nextSlide, prevSlide }) => {
  const slide_pages = [
    {
      styles: {
        background: theme.palettes.success[95],
        check_background: theme.schemes.light.success,
        check_color: theme.palettes.success[100],
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
        background: theme.palettes.secondary[95],
        check_background: theme.schemes.light.secondary,
        check_color: theme.palettes.secondary[100],
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
        background: theme.palettes.error[95],
        check_background: theme.palettes.error[70],
        check_color: theme.palettes.error[100],
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
        <Slide_title>{slide_pages[current_slide].content.title}</Slide_title>
        <Slide_subtitle>
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
