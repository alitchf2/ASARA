/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  // Auto-confirm all new sign-ups so users don't need email/SMS verification
  event.response.autoConfirmUser = true;
  return event;
};
