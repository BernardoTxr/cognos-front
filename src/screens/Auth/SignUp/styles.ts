import { StyleSheet } from "react-native";
import { Colors, Fonts, Spacing } from "../../../themes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.ligth,
    paddingHorizontal: Spacing.large,
    justifyContent: "center",
  },
  scrollView: {
    maxHeight: "80%"
  },
  innerContainer: {
    maxHeight: "80%",
  },
  inputSpacing: {
    marginTop: Spacing.medium,
  },
  buttonSpacing: {
    marginTop: Spacing.large,
  },
  errorText: {
    color: Colors.danger,
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.small,
    marginTop: Spacing.small,
    textAlign: "center",
  },
    loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.large,
  },
 loginText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.small,
    color: Colors.text,
  },
    linkText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.small,
  },
});

export default styles;
