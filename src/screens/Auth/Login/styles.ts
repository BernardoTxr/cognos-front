import { StyleSheet } from "react-native";
import { Colors, Fonts, Spacing } from "../../../themes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.ligth,
    paddingHorizontal: Spacing.large,
    justifyContent: "center",
  },
    mainContainer: {
    flex: 1,
    justifyContent: "center",
    width: "60%",
    alignSelf: "center"
  },
  inputSpacing: {
    marginTop: Spacing.medium,
  },
  buttonSpacing: {
    marginTop: Spacing.large,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: Spacing.small,
  },
  linkText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.small,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.large,
  },
  signupText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.small,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background.ligth,
    padding: Spacing.xlarge,
    borderRadius: Spacing.boderRadius,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.large,
    marginBottom: Spacing.medium,
    color: Colors.text,
  },
  modalCloseButton: {
    position: "absolute",
    top: Spacing.small,
    left: Spacing.medium,
    zIndex: 1,
  },
  modalCloseIcon: {
    fontSize: 28,
    color: Colors.text,
    fontFamily: Fonts.bold,
  }, logo: {
    width: "80%",
    height: "30%",
    alignSelf: "center",
  }
});

export default styles;
