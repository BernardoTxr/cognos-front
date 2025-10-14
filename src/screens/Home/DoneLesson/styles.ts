import { StyleSheet } from "react-native";
import { Colors, Spacing, Fonts } from "../../../themes";

const styles = StyleSheet.create({
  innerProgressBar: {
    width: "80%",
    margin: Spacing.large,
  },
  progressBar: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
  }, percentText: {
    fontFamily: Fonts.bold,
  }, text: {
    fontFamily: Fonts.regular,
    width: "80%",
    alignSelf: "center"
  }, titleText: {
    fontFamily: Fonts.bold,
    fontSize: Spacing.large,
  }, mentuca: {
    width: "70%",
    height: "30%"
  }

})

export default styles;