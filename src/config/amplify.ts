import { Amplify } from "aws-amplify";
import awsExports from "../../aws-exports.template";

export function configureAmplify() {
  Amplify.configure(awsExports);
}
