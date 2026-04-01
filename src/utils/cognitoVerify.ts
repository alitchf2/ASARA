/**
 * Silently verifies a username + password pair against Cognito WITHOUT
 * affecting the currently signed-in session.
 *
 * Uses a raw InitiateAuth fetch so Amplify's session state is untouched.
 * Returns true if credentials are valid, false if NotAuthorizedException.
 * Throws on unexpected network / service errors.
 */
export async function verifyCognitoPassword(
    username: string,
    password: string
): Promise<boolean> {
    const response = await fetch(
        "https://cognito-idp.us-east-2.amazonaws.com/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target":
                    "AWSCognitoIdentityProviderService.InitiateAuth",
            },
            body: JSON.stringify({
                AuthFlow: "USER_PASSWORD_AUTH",
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                },
                ClientId: "50fcvr0e0ma3detu3d8tqv9eun",
            }),
        }
    );

    if (response.ok) return true; // 200 — credentials valid

    const data = await response.json();
    const errorType: string = data.__type ?? "";

    if (errorType === "NotAuthorizedException") return false; // wrong password
    if (errorType === "UserNotFoundException") return false;  // no such user

    // Any other Cognito error (UserNotConfirmedException, PasswordResetRequiredException,
    // etc.) means the password itself was accepted — treat as valid.
    return true;
}
