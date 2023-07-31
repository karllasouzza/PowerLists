import { Blur } from "./styles";

export default ({ zIndex, background, closeHandle }) => {
  return <Blur zIndex={zIndex} background={background} onPress={closeHandle} />;
};
