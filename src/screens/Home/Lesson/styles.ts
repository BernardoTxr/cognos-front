import { StyleSheet } from "react-native";
import { Colors, Spacing } from "../../../themes";

const styles = StyleSheet.create({

container: {
    flex: 1, 
    width: "100%",
    marginVertical: Spacing.small,
    alignItems: "center",
    flexDirection: "column",
}, upperBarContainer:{
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    height: "7.5%",
    marginTop: Spacing.xlarge,
}, innerProgressBar: {
    width: "75%",
    alignSelf: "center",
}, progressBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
}, iconButton: {
    marginVertical: Spacing.small,
    backgroundColor: Colors.pink.ligth,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
    closeButton: {
    width: "12.5%",
    padding: Spacing.xsmall,
  }
  });

export default styles;