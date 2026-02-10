# ColorFind Developer Guide

This guide helps developers set up the **ColorFind** project locally.

## Prerequisites

*   **Node.js**: [Download & Install](https://nodejs.org/) (LTS recommended)
*   **Git**: [Download & Install](https://git-scm.com/)
*   **Expo Go App**: Install from the App Store (iOS) or Google Play (Android) on your mobile device.

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

## Running the App

1.  **Start the Development Server**
    ```bash
    npx expo start
    ```
    (Or `npm start`)

2.  **Run on Mobile Device (Recommended)**
    *   **Android:** Open **Expo Go** and scan the QR code from the terminal.
    *   **iOS:** Open the **Camera** app, scan the QR code, and tap the notification to open in **Expo Go**.
    *   **Important:** Ensure your computer and phone are connected to the **same Wi-Fi network**.

3.  **Run on Emulators**
    *   **Android:** `npm run android` (Requires Android Studio)
    *   **iOS:** `npm run ios` (Requires Xcode - Mac only)

## Troubleshooting

*   **Connection Issues:** If the app won't load, try tunnel mode:
    ```bash
    npx expo start --tunnel
    ```
*   **Cache Clearing:** If you see strange errors, clear the bundler cache:
    ```bash
    npx expo start --clear
    ```

## Credits

Documentation created with the assistance of Google DeepMind's AI.
