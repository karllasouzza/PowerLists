import { Path, Svg } from "react-native-svg";

export default ({ background, width }) => {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={width}
      viewBox='0 0 24 24'
      fill='none'>
      <Path
        d='M19 2.01001H6C4.794 2.01001 3 2.80901 3 5.01001V19.01C3 21.211 4.794 22.01 6 22.01H20C20.5523 22.01 21 21.5623 21 21.01V21.01C21 20.4577 20.5523 20.01 20 20.01H6.012C5.55 19.998 5 19.815 5 19.01C5 18.909 5.009 18.819 5.024 18.737C5.136 18.162 5.607 18.02 6.011 18.01H20C20.018 18.01 20.031 18.001 20.049 18V18C20.5742 18 21 17.5742 21 17.049V4.01001C21 2.90701 20.103 2.01001 19 2.01001ZM19 10.01C19 13.3237 16.3137 16.01 13 16.01H12C8.13401 16.01 5 12.876 5 9.01001V5.01001C5 4.20401 5.55 4.02201 6 4.01001H10.3262C11.8029 4.01001 13 5.20709 13 6.68377V9.30181C13 10.0866 13.8259 10.5971 14.5279 10.2461V10.2461C14.8251 10.0975 15.1749 10.0975 15.4721 10.2461V10.2461C16.1741 10.5971 17 10.0866 17 9.30181V5.01001C17 4.45773 17.4477 4.01001 18 4.01001V4.01001C18.5523 4.01001 19 4.45773 19 5.01001V10.01Z'
        fill={background}
      />
    </Svg>
  );
};
