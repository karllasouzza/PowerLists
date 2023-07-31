import CheckIcon from "../../../assets/svgs/CheckIcon.jsx";
import { Color } from "./styles.js";

export default ({ width, height, color, selected, tap }) => {
  return (
    <Color
      width={width}
      height={height}
      color={color}
      selected={selected === color}
      onPress={() => (selected !== color ? tap(color) : null)}>
      {selected === color ? <CheckIcon width={20} background='white' /> : null}
    </Color>
  );
};
