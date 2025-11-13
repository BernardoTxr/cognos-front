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
    maxHeight: "70%"
  },
  innerContainer: {
    maxHeight: "80%",
    width: "60%",
    alignSelf: "center",
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
  }, pickerContainer: {
  borderColor: "#ccc",
  marginTop: 5,
  marginBottom: 10,
  borderWidth: 1.5,
    borderRadius: Spacing.boderRadius,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.ligth,
    width: "90%",
},
picker: {
  height: 50,
  width: "100%",
},
label: {
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
},
});

export default styles;
