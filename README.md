# ColorFind Developer Guide

This guide helps developers set up the **ColorFind** project locally.

## Prerequisites

- **Node.js**: [Download & Install](https://nodejs.org/) (LTS recommended)
- **Git**: [Download & Install](https://git-scm.com/)
- **Expo Go App**: Install from the App Store (iOS) or Google Play (Android) on your mobile device.

## Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone <YOUR_REPOSITORY_URL_HERE>
    cd ColorFind
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    > **Note:** If you encounter permission errors, try using a terminal with Administrator privileges (Windows) or `sudo` (Mac/Linux).

3.  **AWS Amplify CLI Setup**
    Since ColorFind uses AWS services (Cognito, DynamoDB, API Gateway, etc.), you need to install and configure the AWS Amplify CLI to sync the backend resources to your local machine.
    
    *Install the CLI globally:*
    ```bash
    npm install -g @aws-amplify/cli
    ```
    
    *Configure the CLI:*
    ```bash
    amplify configure
    ```
    
    **The configuration process will walk you through the following steps:**
    - **Browser Login:** The CLI will automatically open your default browser. Sign in to your AWS Administrator Console. Once logged in, return to the terminal and press `Enter`.
    - **Specify Region:** Choose the AWS Region that matches the project's setup (e.g., `us-east-1`).
    - **Create IAM User:** It will ask you to specify a username (e.g., `amplify-admin`). It then opens the AWS Console to finish creating the IAM user. Accept the default `AdministratorAccess-Amplify` permissions template, and create the user.
    - **Enter Credentials:** After the IAM user is successfully created in the browser, copy the newly generated `Access Key ID` and `Secret Access Key` and paste them back into the terminal prompts.
    - **Profile Name:** It will ask for a profile name. Press `Enter` to use `default` or type a specific name.
    
    Once successfully configured, pull the backend down into your local project by running:
    ```bash
    amplify pull
    ```

## Running the App

1.  **Start the Development Server**

    ```bash
    npx expo start
    ```

    (Or `npm start`)

2.  **Run on Mobile Device (Recommended)**
    - **Android:** Open **Expo Go** and scan the QR code from the terminal.
    - **iOS:** Open the **Camera** app, scan the QR code, and tap the notification to open in **Expo Go**.
    - **Important:** Ensure your computer and phone are connected to the **same Wi-Fi network**.

3.  **Run on Emulators**
    - **Android:** `npm run android` (Requires Android Studio)
    - **iOS:** `npm run ios` (Requires Xcode - Mac only)

## Troubleshooting

- **Connection Issues:** If the app won't load, try tunnel mode:
  ```bash
  npx expo start --tunnel
  ```
- **Cache Clearing:** If you see strange errors, clear the bundler cache:
  ```bash
  npx expo start --clear
  ```

## Credits

Documentation created with the assistance of Google DeepMind's AI.
