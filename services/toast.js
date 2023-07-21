import { BaseToast, ErrorToast } from "react-native-toast-message";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import theme from "../assets/theme.json";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.coreColors.success }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: theme.palettes.success[90],
      }}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
        color: theme.coreColors.success,
      }}
      text2Style={{
        fontSize: 15,
        color: theme.coreColors.white,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: theme.coreColors.error }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: theme.palettes.error[90],
      }}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
        color: theme.coreColors.error,
      }}
      text2Style={{
        fontSize: 15,
        color: theme.coreColors.white,
      }}
    />
  ),
};

export const showToast = ({ type, title, subtitle }) => {
  Toast.show({
    type: type,
    text1: title,
    text2: subtitle,
  });
};
