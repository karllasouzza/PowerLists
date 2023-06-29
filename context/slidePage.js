import React, { createContext, useState } from "react";
import Slides from "../components/Slides";

const SlideContext = createContext({ signed: true });

export const SlideProvider = ({ children }) => {
  const [current_slide, setCurrentSlide] = useState(0);

  async function nextSlide() {
    setCurrentSlide(current_slide + 1);
  }

  return (
    <SlideContext.Provider value={{ current_slide, nextSlide }}>
      {current_slide < 3 ? <Slides /> : children}
    </SlideContext.Provider>
  );
};

export default SlideContext;
