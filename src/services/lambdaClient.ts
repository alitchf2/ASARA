import { put } from "aws-amplify/api";

/**
 * Updates the current user's username via the UpdateUserProfile Lambda.
 * The Cognito JWT is attached automatically by Amplify — userID is extracted
 * server-side from the verified token, never trusted from the client payload.
 *
 * @returns { success: true } or throws on error/username taken
 */
export async function updateUsername(newUsername: string): Promise<void> {
    const { body } = await put({
        apiName: "colorfindAPI",
        path: "/users/me",
        options: {
            body: { newUsername },
        },
    }).response;

    const result = (await body.json()) as { success: boolean; error?: string };

    if (!result.success) {
        throw Object.assign(new Error(result.error ?? "Update failed"), {
            code: result.error,
        });
    }
}
