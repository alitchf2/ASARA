import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports.js";

export function configureAmplify() {
  Amplify.configure(awsExports);
}
