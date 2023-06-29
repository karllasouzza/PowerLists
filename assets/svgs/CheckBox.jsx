import { Path, Svg } from "react-native-svg";

export default function CheckBox({
  background,
  check_color,
  checked,
  next,
  prev,
}) {
  const NotCheck = () => (
    <Svg
      onPress={() => next()}
      width='84'
      height='84'
      viewBox='0 0 84 84'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        opacity='0.4'
        d='M58.3333 7H25.6667C13.7511 7 7 13.7511 7 25.6667V58.3333C7 70.2178 13.72 77 25.6667 77H58.3333C70.2489 77 77 70.2178 77 58.3333V25.6667C77 13.7511 70.2489 7 58.3333 7Z'
        fill={background}
      />
    </Svg>
  );

  const Checked = () => (
    <Svg
      onPress={() => prev()}
      width='84'
      height='84'
      viewBox='0 0 84 84'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        opacity='0.4'
        d='M40 23H19C11.34 23 7 27.34 7 35V56C7 63.64 11.32 68 19 68H40C47.66 68 52 63.64 52 56V35C52 27.34 47.66 23 40 23Z'
        fill={background}
      />
      <Path
        d='M35.9012 50.9999C34.6083 51.0066 33.3154 50.535 32.3188 49.5653L19.4975 37.0789C17.5178 35.1395 17.4976 31.9913 19.4571 30.0386C21.4167 28.0793 24.6153 28.0594 26.6018 29.9921L35.8272 38.9718L58.3519 16.4829C60.3182 14.5236 63.5168 14.5036 65.4966 16.4364C67.483 18.3758 67.5032 21.5306 65.5437 23.4766L39.4634 49.5188C38.4803 50.5018 37.1941 50.9933 35.9012 50.9999'
        fill={check_color}
      />
    </Svg>
  );

  return !checked ? NotCheck() : Checked();
}
