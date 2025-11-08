import CheckIcon from "../../../../assets/svgs/CheckIcon.jsx";
import { Color } from "./styles.js";

export default ({
  width,
  height,
  theme,
  color,
  selected,
  onSelectedColor,
  selectedColor,
  tap,
}) => {
  return (
    <Color
      width={width}
      height={height}
      theme={theme}
      color={color}
      selected={selected === color}
      onSelectedColor={onSelectedColor}
      selectedColor={selectedColor}
      onPress={() => (selected !== color ? tap(color) : null)}>
      {selected === color ? <CheckIcon width={20} background={onSelectedColor} /> : null}
    </Color>
  );
};
