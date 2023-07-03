import React, { createContext, useState } from "react";
import Slides from "../components/Slides";

const SlideContext = createContext();

export const SlideProvider = ({ children }) => {
  const [current_slide, setCurrentSlide] = useState(0);

  async function nextSlide() {
    setCurrentSlide(current_slide + 1);
  }

  async function prevSlide() {
    setCurrentSlide(current_slide - 1);
  }

  return (
    <SlideContext.Provider value={{ current_slide, nextSlide, prevSlide }}>
      {current_slide < 3 ? (
        <Slides
          current_slide={current_slide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
        />
      ) : (
        children
      )}
    </SlideContext.Provider>
  );
};

export default SlideContext;
