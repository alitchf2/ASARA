# COLORFIND by ASARA - Development Tasks
**Project:** Colorfind Mobile App  
**Platform:** React Native (Expo) - iOS & Android  
**Team:** Alex Litchfield (Full Stack - Frontend Focus), Sean Horne (API Engineer), Adam Lupfer (Full Stack - Backend Focus), Robert Gross (Cloud Technician), Amy Xiong (Database Engineer)  

**Reference:** Colorfind by ASARA v1.0 PDR

---

## TASK STRUCTURE
Each task follows this format:
- **Task ID**: Unique identifier
- **Title**: Brief task name
- **Assignee**: Role - Person
- **PDR Reference**: Section(s) in PDR
- **Description**: What needs to be done
- **Dependencies**: Task IDs that must be completed first
- **Acceptance Criteria**: Specific, testable outcomes
- **Testing Notes**: Special testing considerations (if applicable)
- **Current Status**: Status of the task such as in progress or complete
- **Notes**: Any notes of what was done to the code in order to complete the task

---

# PHASE 1 - FOUNDATION & EXACT POINT DETECTION

## 1. PROJECT SETUP & INFRASTRUCTURE

### 1.1 - Initialize Expo React Native Project
**Assignee:** Full Stack Frontend - Adam  
**PDR Reference:** Section 16  
**Description:** Create new Expo React Native project with TypeScript configuration. Set up project structure with organized directories for screens, components, services, utils, types, and assets.  
**Dependencies:** None  
**Acceptance Criteria:**
- Expo project created with TypeScript enabled
- Project runs successfully on iOS simulator/device and Android emulator/device
- Folder structure in place: `/src/screens`, `/src/components`, `/src/services`, `/src/utils`, `/src/types`, `/src/assets`, `/src/config`
- `.gitignore` configured to exclude node_modules, build artifacts, env files
- `app.json` configured with app name "Colorfind by ASARA" and portrait-only orientation lock
**Current Status:** Complete
**Notes:** Folder structure needs to be looked at again because empty folders are not getting pushed to Git (such as src folders that aren't screens).

---

### 1.2 - Configure Development and Production Environments
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 10.2  
**Description:** Set up environment configuration for dev and production environments. Configure environment-specific variables (API URLs, AWS resource names with env suffixes).  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Environment config files created (e.g., `config/env.dev.ts`, `config/env.prod.ts`)
- Environment switcher implemented to select correct config based on build type
- Variables include: API base URL, DynamoDB table names with `-dev`/`-prod` suffix, S3 bucket names, Cognito pool IDs
- No hardcoded environment-specific values in application code
**Current Status:** Not Started
**Notes:** 

---

### 1.3 - Install and Configure AWS Amplify
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 10.1  
**Description:** Install AWS Amplify CLI and Amplify libraries. Initialize Amplify in the project. Configure Amplify for Auth (Cognito), Analytics (Pinpoint), and Storage (S3).  
**Dependencies:** 1.2  
**Acceptance Criteria:**
- `amplify init` completed successfully for dev and prod environments
- Amplify Auth configured to use Cognito User Pools
- Amplify Analytics configured with Pinpoint
- Amplify configured in application entry point (`App.tsx`)
- `aws-exports.js` generated and gitignored (template version checked in)
**Current Status:** Not Started
**Notes:** Installed Amplify CLI and created perms in IAM. Setup cognito pools, s3 storage, and Amazon Kinesis Streams(pivoted for analtyics becaue pinpoint is End of Life and no longer accepting new users)
Region: US East 2
Project Name: Colorfind
Cognito Sign In Method: Username(requires Email for signup)
S3 Bucket Name: colorfind-images-dev
Amazon Kinesis Stream Name: colorfindAnalytics. WE NEED TO DISCUSS IMPLEMENTATION BECAUSE IT IS NOT AWS FREE TIER.

---

### 1.4 - Set Up CI/CD Pipeline with Amplify
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 10.1  
**Description:** Configure AWS Amplify CI/CD for automatic deployments. Set up dev and production branches with automatic builds on push.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Amplify app created in AWS Console
- Dev branch connected and building on commit
- Production branch connected and building on commit
- Build settings configured correctly for React Native
- Deployment notifications configured
**Current Status:** Not Started
**Notes:** 

---

### 1.5 - Configure Portrait Orientation Lock
**Assignee:** Full Stack Frontend - Adam  
**PDR Reference:** Section 3.1, Section 13.1  
**Description:** Lock app to portrait orientation only on both iOS and Android.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- `app.json` orientation set to `"portrait"`
- iOS `Info.plist` configured to disable landscape
- Android `AndroidManifest.xml` configured to disable landscape
- App cannot rotate to landscape on either platform when device is rotated
**Current Status:** Complete
**Notes:** Was done in the app.json file. Added requiresFullScreen to make it work.

---

## 2. AWS BACKEND INFRASTRUCTURE

### 2.1 - Create DynamoDB Users Table
**Assignee:** Database - Amy  
**PDR Reference:** Section 8.2  
**Description:** Create `colorfind-users-dev` and `colorfind-users-prod` DynamoDB tables with on-demand capacity. Set up partition key and GSI.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Table created in both dev and prod AWS accounts
- Partition key: `userID` (String)
- GSI created: `username-index` with partition key `username` (String), projection type KEYS_ONLY
- On-demand billing mode enabled
- Server-side encryption enabled (default AWS managed key)
**Current Status:** Not Started
**Notes:** 

---

### 2.2 - Create DynamoDB Colors Master Table
**Assignee:** Database - Amy  
**PDR Reference:** Section 8.3  
**Description:** Create `colorfind-colors-master` DynamoDB table (single table, not environment-specific). This table will be populated later in task 6.3.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Table created in both dev and prod AWS accounts
- Partition key: `colorID` (String)
- On-demand billing mode enabled
- Server-side encryption enabled
- Table is empty (seeding is a separate task)
**Current Status:** Not Started
**Notes:** 

---

### 2.3 - Create DynamoDB Reference Objects Table
**Assignee:** Database - Amy  
**PDR Reference:** Section 8.4  
**Description:** Create `colorfind-objects-dev` and `colorfind-objects-prod` DynamoDB tables with on-demand capacity. Set up composite key and GSI.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Table created in both dev and prod AWS accounts
- Partition key: `userID` (String)
- Sort key: `objectID` (String)
- GSI created: `userID-family-index` with partition key `userID`, sort key `familyColorName`, projection type ALL
- On-demand billing mode enabled
- Server-side encryption enabled
**Current Status:** Not Started
**Notes:** 

---

### 2.4 - Create S3 Bucket for Images
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 9.1  
**Description:** Create S3 buckets `colorfind-images-dev` and `colorfind-images-prod` with private access and encryption.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Buckets created in both dev and prod AWS accounts
- All public access blocked via S3 Block Public Access settings
- Server-side encryption enabled (AES-256 / SSE-S3)
- Versioning disabled
- Folder structure plan documented: `users/{userID}/saved/{objectID}.jpg`, `models/segmentation_{version}.tflite`
**Current Status:** Not Started
**Notes:** 

---

### 2.5 - Create Cognito User Pool
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 2.1, Section 10.1  
**Description:** Create Cognito User Pools for dev and prod environments. Configure for username/password auth with no email requirement.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- User Pool created in both dev and prod AWS accounts
- Sign-in method: username only (not email or phone)
- Password policy: minimum 8 characters, no additional complexity requirements
- MFA disabled
- No email verification required (email field not collected)
- User Pool app client created for the mobile app
- Refresh token expiration set to 30 days
**Current Status:** Not Started
**Notes:** 

---

### 2.6 - Create Cognito Identity Pool
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 10.1, Section 11.2  
**Description:** Create Cognito Identity Pools linked to User Pools. Configure IAM roles for authenticated users to access S3 via pre-signed URLs.  
**Dependencies:** 2.4, 2.5  
**Acceptance Criteria:**
- Identity Pool created in both dev and prod, linked to corresponding User Pool
- Authenticated role IAM policy created with permissions to generate S3 pre-signed URLs (via Lambda - no direct S3 access)
- Unauthenticated role has no permissions
- Trust relationship configured correctly between Identity Pool and User Pool
**Current Status:** Not Started
**Notes:** 

---

### 2.7 - Create API Gateway REST API
**Assignee:** API - Sean  
**PDR Reference:** Section 10.1, Section 10.3  
**Description:** Create API Gateway REST APIs for dev and prod environments. Configure Cognito authorizer for protected endpoints.  
**Dependencies:** 2.5  
**Acceptance Criteria:**
- API Gateway REST API created in both dev and prod AWS accounts
- Base URLs documented: `https://api.colorfind.app/dev/` and `https://api.colorfind.app/prod/`
- Cognito authorizer configured using User Pool
- HTTPS enforced (HTTP rejected)
- CORS enabled for mobile app origin
- CloudWatch logging enabled
**Current Status:** Not Started
**Notes:** 

---

### 2.8 - Set Up IAM Roles for Lambda Functions
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 10.4  
**Description:** Create IAM execution roles for Lambda functions with appropriate permissions for DynamoDB, S3, Cognito, and CloudWatch.  
**Dependencies:** 2.1, 2.2, 2.3, 2.4, 2.5  
**Acceptance Criteria:**
- IAM role created for Lambda execution
- Permissions include: DynamoDB read/write on all app tables, S3 read/write on app buckets, Cognito admin actions, CloudWatch Logs write
- Least-privilege principle applied (no wildcard resource ARNs where specific resources can be specified)
- Role assumable by Lambda service
**Current Status:** Not Started
**Notes:** 

---

## 3. AUTHENTICATION & USER MANAGEMENT

### 3.1 - Build Sign In Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.2  
**Description:** Create Sign In screen with username/password inputs, Sign In button, Continue as Guest link, and Create Account link.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Screen layout matches Section 5.2.1: app logo centered in upper third, username input, password input with show/hide toggle, primary Sign In button, secondary links for Guest and Create Account
- Password field masked by default with eye icon toggle to show/hide
- All inputs have proper keyboard types (text for username, secure entry for password)
- No internet banner placeholder (functionality added in task 3.7)
- Navigation to Create Account screen functional
- Navigation to Find Color screen in guest mode functional (auth logic added in task 3.4)
**Status:** Complete
**Notes:** Changed file structue of App.tsx to where there is a Stack Navigator. Completed the UI layout and added deterministic target-slot scroll behavior so fields slide exactly into place over the keyboard without breaking the 30/70 interface ratios. Replaced the deprecated `SafeAreaView` from `react-native` with `react-native-safe-area-context` and wrapped the NavigationContainer in a `SafeAreaProvider` inside `App.tsx`.

---

### 3.2 - Build Create Account Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.3  
**Description:** Create Account screen with username/password inputs, Terms/Privacy checkbox, and Create Account button.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Screen layout matches Section 5.3.1: back arrow, username input, password input with show/hide toggle, Terms checkbox with linked text, Create Account button
- Back arrow navigates to Sign In screen
- Create Account button disabled until both fields filled and checkbox checked
- Checkbox label: "I agree to the Terms of Service and Privacy Policy" with linked text
- Tapping linked text opens Terms/Privacy screen (screen built in task 14.1)
- Inline validation error messages display below respective fields
**Status:** Complete
**Notes:** Created the UI for Create Account screen including deterministic dynamic keyboard scrolling. Implemented dynamic branch-tree password validation logic that evaluates requirements live and visually updates. Added a static sticky header to hold the back arrow so the logo can slide underneath securely. Also refactored the file structure of the auth screens to be more organized.

---

### 3.3 - Implement Terms of Service and Privacy Policy Screen
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 14.2, Section 14.3, Section 14.4  
**Description:** Create read-only scrollable screen displaying Terms of Service and Privacy Policy text. This screen is accessed from Create Account screen checkbox link.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Scrollable full-screen view with back button
- Terms of Service text includes: app provided as-is disclaimer, no unlawful use, user retains image ownership with limited storage license, ASARA can update terms at any time
- Privacy Policy text includes: what is collected (username, saved colors, images, anonymous analytics), what is NOT collected (email, real name, device identifiers, location, biometrics), how data is used (color identification, personal library, analytics for improvement only), image privacy (S3 private, user-only access), data deletion (immediate and complete on account delete)
- Text is readable with appropriate font size and padding
- No data submission required on this screen

**Testing Notes:** Have a non-technical person read the policy text to confirm plain language clarity.
**Current Status:** Complete
**Notes:** Created the `TermsOfServiceScreen.tsx` layout using a full-page scroll view, implemented typography styles for readability, inserted all required privacy and terms clauses, and matched the seamless layout styling from the Create Account screen. Checked out perfectly with Typescript.

---

### 3.4 - Implement Sign In Authentication Logic
**Assignee:** API - Sean, Full Stack Backend - Adam  
**PDR Reference:** Section 2.1, Section 5.2.2  
**Description:** Integrate Amplify Auth sign-in on Sign In screen. Handle success (navigate to Find Color) and failure (show inline error).  
**Dependencies:** 1.3, 2.5, 3.1  
**Acceptance Criteria:**
- Tapping Sign In calls `Auth.signIn()` with username and password
- On success: user authenticated, Cognito tokens stored, navigation to Find Color screen
- On failure: inline error message displays below password field: "Incorrect username or password."
- Loading indicator shown during authentication
- No plain text password logging
**Current Status:** Finished
**Notes:** Had to reconfigure amplify to not require email accounts for signup. This task will immediately precede the next couple of tasks that work on user account creation and sign-ins. 

---

### 3.5 - Implement Create Account Registration Logic
**Assignee:** API - Sean, Full Stack Backend - Adam  
**PDR Reference:** Section 2.1.1, Section 5.3.2  
**Description:** Implement account creation flow including username uniqueness check and Cognito sign-up.  
**Dependencies:** 1.3, 2.5, 3.2, 3.8 (CheckUsernameAvailability Lambda)  
**Acceptance Criteria:**
- Before calling Cognito sign-up, call `/auth/check-username` Lambda to verify username is available
- If username taken: show inline error "That username is already in use."
- If password <8 characters: show inline error "Password must be at least 8 characters."
- If checkbox not checked: show inline error "You must agree to the Terms of Service to create an account."
- On successful validation: call `Auth.signUp()` with username and password (no email)
- On successful sign-up: automatically sign in user and navigate to Find Color screen
- Write user record to DynamoDB Users table with userID (Cognito sub), username, createdAt timestamp
- Handle Cognito errors gracefully (e.g., username already exists in Cognito despite check)

**Testing Notes:** Test race condition where two users try to register the same username simultaneously.
**Current Status:** Completed
**Notes:** Had to go into Cognito user pool App clients to physically switch the ALLOW_USER_PASSWORD_AUTH to be enabled for password sign-in and account creation.

---

### 3.6 - Implement Guest Mode Navigation
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 2.2, Section 5.2.2  
**Description:** Implement guest mode flag and navigation logic. Guest users skip authentication and proceed directly to Find Color screen.
**Dependencies:** 3.1  
**Acceptance Criteria:**
- Tapping "Continue as Guest" sets global guest mode flag to true
- Navigation to Find Color screen occurs immediately without Cognito calls
- Guest flag persists in memory only (cleared on app close)
- No data written to any database for guest users
**Current Status:** Complete
**Notes:** Implemented global `isGuest` flag using React Context (`AuthContext.tsx`). Flag is memory-only and resets on app restart or explicit sign-in/out. Refactored `SignInScreen` to use this global state. Performed a major codebase refactor to globalize the guest modal state and logic, ensuring a single reusable instance (`GlobalGuestModal`) is used across all feature entry points. This centralized architecture removes redundant local states and prevents visual 'flashing' by intercepting guest access before restricted screens ever mount.

---

### 3.7 - Implement No Internet Connection Detection
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.2.1, Section 12.2  
**Description:** Add internet connectivity check on Sign In screen launch. Display non-dismissible banner if offline.  
**Dependencies:** 3.1  
**Acceptance Criteria:**
- Use Expo NetInfo to check connectivity on Sign In screen mount
- If no internet: display banner/modal at top of screen: "No internet connection. Colorfind requires an active internet connection to function."
- Banner is non-dismissible (no X button, cannot tap outside to close)
- Connectivity re-checked every 5 seconds while banner is visible
- Banner auto-dismisses when connectivity restored
- Sign In/Create Account buttons remain disabled while offline
**Current Status:** Complete
**Notes:** Built a Global Offline Modal (`GlobalOfflineModal.tsx`) that mounts on `App.tsx`. The modal completely freezes the UI with a native transparent overlay and offers a manual Retry button, while the `useNetworkStatus` hook continues to run the required 5-second automatic polling safely in the background across all screens universally.

---

### 3.8 - Create CheckUsernameAvailability Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.1, Section 10.4  
**Description:** Create Lambda function to query username-index GSI on Users table to check if username exists.  
**Dependencies:** 2.1, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `GET /auth/check-username?username={string}`
- No Cognito authorization required (public endpoint)
- Query username-index GSI on Users table
- Return `{ available: boolean }`
- Return `available: false` if any record found, `available: true` if no records
- Logs to CloudWatch
- Response time <500ms
**Current Status:** Not Started
**Notes:** 

---

### 3.9 - Build User Settings Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.12  
**Description:** Create User Settings screen showing username, masked password, edit icon, Sign Out button, and Delete Account button.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Screen layout matches Section 5.12.1: back arrow, username (plain text), password (masked as '••••••••'), edit icon (pencil), Sign Out button, Delete Account button (red/destructive styling)
- Back arrow navigates to previous screen
- Edit icon tap opens password confirmation modal (logic in task 3.12)
- Sign Out button tap triggers sign-out flow (logic in task 3.10)
- Delete Account button tap triggers deletion flow (logic in task 3.13)
- Screen inaccessible to guest users (redirect to Sign In with explanation - logic in task 3.11)
**Current Status:** Complete
**Notes:** 
- Developed the `UserSettingsScreen.tsx` following the 30/70 UI ratio and branding guidelines.
- Implemented the header with back navigation and a pencil edit icon for entering edit mode.
- Created sections for Username and Password (masked with bullets).
- Integrated `BrandedButton` and `AuthInput` custom components for consistency.
- Handled guest user redirection via a branded fallback UI that prompts for Sign In.
- Optimized UI by extracting inline modals into reusable `ActionModal` and `FeedbackModal` components.

---

### 3.10 - Implement Sign Out Functionality
**Assignee:** API - Sean, Full Stack Backend - Adam  
**PDR Reference:** Section 2.3, Section 5.12  
**Description:** Implement sign-out logic to clear Amplify Auth session and navigate to Sign In screen.  
**Dependencies:** 1.3, 3.9  
**Acceptance Criteria:**
- Tapping Sign Out calls `Auth.signOut()`
- Amplify Auth session cleared (tokens removed from secure storage)
- Navigation to Sign In screen
- Recent photos remain on device if user was authenticated (per Section 3.5 - persist across sessions)
- No server-side calls required (token invalidation handled by Cognito automatically)
**Current Status:** Not Started
**Notes:** 

---

### 3.11 - Implement Guest User Redirect to Sign In
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 2.2, Section 5.12.4  
**Description:** Add logic to redirect guest users who attempt to access User Settings, Saved Colors, or Compare features.  
**Dependencies:** 3.6, 3.9  
**Acceptance Criteria:**
- If guest user taps User Settings icon: show modal "Sign in to access account settings." with Sign In button that navigates to Sign In screen
- If guest user taps Saved Colors tab: show modal "Sign in to view your saved colors." with Sign In button
- If guest user taps Compare Color button: show modal "Sign in to compare colors." with Sign In button
- Modals dismissible (user can tap outside or X button to close and stay on current screen)
**Current Status:** In Progress
**Notes:** Implemented guest redirection logic for User Settings and Saved Colors features. Intercepted navigation at the `CustomTabBar` level for the "Saved" tab to prevent unauthorized screens from mounting and providing a smoother UI experience. Added a top-level `GlobalGuestModal` and disabled tab swiping for guest users to prevent accidental bypass of redirection logic. Note: Redirection for the "Compare" feature is currently pending as the Compare button/screen has not yet been implemented in the application UI.

---

### 3.12 - Implement Edit Username/Password Flow
**Assignee:** Full Stack Backend - Adam, API - Sean  
**PDR Reference:** Section 5.12.2  
**Description:** Build edit mode for User Settings allowing username and password changes after current password confirmation.  
**Dependencies:** 3.9, 3.16 (UpdateUserProfile Lambda)  
**Acceptance Criteria:**
- Tapping edit icon shows modal: "Enter your current password to make changes."
- User enters current password → calls `Auth.currentAuthenticatedUser()` and verifies password via `Auth.changePassword()` test
- On incorrect password: inline error "Incorrect password."
- On correct password: show edit form with new username field (pre-filled with current), new password field (blank), confirm password field (blank)
- All fields optional - only changed fields submitted
- New username validation: call `/auth/check-username` to verify not taken
- New password validation: minimum 8 characters, must match confirm password field
- On Save Changes: update username in DynamoDB Users table via `/users/me PATCH`, update password in Cognito via `Auth.changePassword()`
- Show success toast "Changes saved successfully."
- Refresh User Settings screen with new username displayed

**Testing Notes:** Test updating username only, password only, both simultaneously, and canceling edit mode.
**Current Status:** In Progress
**Notes:** 
- Built the "Edit Mode" transition requiring current password confirmation via the new `ActionModal` component.
- Implemented a streamlined "Save" flow that validates inputs locally and updates the screen state immediately.
- Integrated the shared `validatePasswordStrength` utility for live requirement checking and used the `PasswordRequirements` branch-tree UI.
- Added TODO placeholders for the required `UpdateUserProfile` API calls.
- Simplified the experience by removing the intermediate confirmation modal, allowing direct save-to-success transitions.

---

### 3.13 - Implement Account Deletion Flow
**Assignee:** Full Stack Backend - Adam, API - Sean  
**PDR Reference:** Section 2.1.3, Section 5.12.3  
**Description:** Build account deletion flow with password confirmation and cascading deletion of all user data.  
**Dependencies:** 3.9, 3.17 (DeleteAccount Lambda)  
**Acceptance Criteria:**
- Tapping Delete Account shows modal: "Enter your current password to make changes."
- User enters current password → verify via `Auth.changePassword()` test or custom verification
- On incorrect password: inline error "Incorrect password."
- On correct password: show confirmation dialog: "Are you sure you want to delete your account? This cannot be undone."
- On confirm: call `/users/me DELETE` with confirmPassword in body
- DeleteAccount Lambda orchestrates: delete Cognito user, delete DynamoDB Users record, batch delete all Reference Objects records for userID, batch delete all S3 objects under `users/{userID}/`
- On success: navigate to Sign In screen, show toast "Your account has been deleted."
- On failure: show error banner with Retry option

**Testing Notes:** Test account deletion with 0 saved colors, 1 saved color, and 10+ saved colors. Verify all S3 objects deleted.
**Current Status:** Not Started
**Notes:** 

---

### 3.14 - Create GetUserProfile Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.5, Section 10.4  
**Description:** Create Lambda function to retrieve user profile (username, createdAt) from Users table.  
**Dependencies:** 2.1, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `GET /users/me`
- Requires Cognito authorization (JWT in Authorization header)
- Extracts userID from Cognito token
- Queries Users table by userID (partition key)
- Returns `{ userID, username, createdAt }`
- Returns 404 if user record not found (should not happen for authenticated users, but handle gracefully)
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 3.15 - Test User Profile Retrieval on User Settings Screen
**Assignee:** Full Stack Backend - Adam, API - Sean
**PDR Reference:** Section 5.12.1  
**Description:** Call GetUserProfile Lambda on User Settings screen mount to display username.  
**Dependencies:** 3.9, 3.14  
**Acceptance Criteria:**
- On User Settings screen mount, call `GET /users/me`
- Display username from response in username field
- Show loading skeleton while API call in progress
- Handle error gracefully (show error message if profile cannot be loaded)
**Current Status:** Not Started
**Notes:** 

---

### 3.16 - Create UpdateUserProfile Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.5, Section 10.4  
**Description:** Create Lambda function to update username in DynamoDB Users table and Cognito User Pool.  
**Dependencies:** 2.1, 2.5, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `PATCH /users/me`
- Requires Cognito authorization
- Request body: `{ newUsername?: string }`
- If newUsername provided: check availability via username-index GSI, return error if taken
- Update username in Users table
- Update username in Cognito User Pool via Admin API
- Return `{ success: boolean, message: string }`
- Handle errors: username taken, Cognito API failure, DynamoDB write failure
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 3.17 - Create DeleteAccount Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.5, Section 10.4  
**Description:** Create Lambda function to orchestrate full account deletion across Cognito, DynamoDB, and S3.  
**Dependencies:** 2.1, 2.3, 2.4, 2.5, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `DELETE /users/me`
- Requires Cognito authorization
- Request body: `{ confirmPassword: string }` (for extra verification)
- Verify password via Cognito (optional secondary check - primary check done client-side)
- Orchestrate deletion in this order:
  1. Batch query and delete all Reference Objects records where userID matches
  2. List all S3 objects under `users/{userID}/` and batch delete
  3. Delete Users table record for userID
  4. Delete Cognito user via Admin API
- Use transactions/batching where possible to ensure atomic operations
- Return `{ success: boolean, message: string }`
- Handle partial failures gracefully (log errors, attempt to complete as much as possible)
- Logs to CloudWatch with detailed step-by-step logging

**Testing Notes:** Critical - test rollback scenarios where S3 delete fails but DynamoDB succeeds, etc.
**Current Status:** Not Started
**Notes:** 

---

## 4. IMAGE CAPTURE & STORAGE

### 4.1 - Install Expo Camera and Configure Permissions
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 3.1, Section 3.2  
**Description:** Install Expo Camera module and configure camera permissions for iOS and Android.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- `expo-camera` package installed
- iOS `Info.plist` includes camera usage description: "Colorfind needs camera access to identify colors from photos."
- Android `AndroidManifest.xml` includes camera permission
- Permission request shown on first access to camera
- Permission handling logic implemented per task 4.3
**Current Status:** Complete
**Notes:** Installed `expo-camera`, configured the native `cameraPermission` string in `app.json`, and implemented the permission request flow. Adam had already done most of this.

---

### 4.2 - Build Find Color Screen with Camera Preview
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.4  
**Description:** Create Find Color screen (bottom tab left) with full-screen camera preview, capture button, recent images button, and user icon.  
**Dependencies:** 4.1  
**Acceptance Criteria:**
- Full-screen Expo Camera preview occupies entire screen behind UI layer
- Rear camera only (no front camera toggle in MVP)
- Portrait orientation locked
- Bottom center: large circular capture button (follows mobile platform design patterns)
- Bottom left beside capture button: recent images icon button
- Top right: circular user icon button
- Bottom navigation bar: color dropper icon (left, active/highlighted), bookmark icon (right, inactive)
- Camera preview resumes when user navigates back from Object Selection screen
**Current Status:** Complete
**Notes:** Built the Camera UI with full-screen preview and UI overlays. Added a header with a Profile button (linking to a placeholder Settings screen) and a footer with a large Capture shutter button and a Recent Images icon placeholder. Updated bottom tab icons to use Ionicons (dropper/bookmark).

---

### 4.3 - Implement Camera Permission Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 3.2, Section 12.2  
**Description:** Implement camera permission request and denial handling on Find Color screen.  
**Dependencies:** 4.2  
**Acceptance Criteria:**
- On Find Color screen focus, check camera permission status via `Camera.requestCameraPermissionsAsync()`
- If granted: show camera preview
- If denied: show full-screen modal: "Camera access is required to use Colorfind. Please enable camera access in your device settings." with button "Open Settings"
- "Open Settings" button calls `Linking.openSettings()` to deep-link to device settings
- Modal does not dismiss until permission granted or user exits app
- Permission status re-checked when app returns from background (user may have changed settings)

**Testing Notes:** Test on both iOS and Android. Test app behavior when user denies permission twice (iOS shows system-level "Don't Ask Again").
**Current Status:** Complete
**Notes:** Implemented a branded fallback screen in `FindColorScreen.tsx` that handles both initial requests and deep-linking to settings for hard-denials. Added an AppState listener to automatically refresh permission status when returning from device settings.
Need to try this on more devices (esspecially android).

---

### 4.4 - Implement Image Capture and Recent Photos Storage
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 3.3, Section 3.5  
**Description:** Implement image capture on capture button tap, save to Recent Photos local storage (up to 6 images, FIFO).  
**Dependencies:** 4.2  
**Acceptance Criteria:**
- Tapping capture button calls `camera.takePictureAsync()` and freezes preview
- Captured image saved to local filesystem via Expo FileSystem
- Image URI added to Recent Photos index stored in AsyncStorage (max 6 URIs)
- If 7th image captured: delete oldest image from filesystem, remove oldest URI from index, add new URI
- Recent Photos logic works for both authenticated and guest users
- For guest users: Recent Photos cleared when app closes (implement app state listener)
- For authenticated users: Recent Photos persist across app sessions (remain local, not synced to cloud)
- Navigation to Object Selection screen after successful capture

**Testing Notes:** Test FIFO deletion logic. Test guest vs authenticated persistence.
**Current Status:** Not Started
**Notes:** 

---

### 4.5 - Build Recent Images Popup UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.4.3  
**Description:** Create bottom-sheet popup showing last 6 recent images in 3x2 grid with selection functionality.  
**Dependencies:** 4.4  
**Acceptance Criteria:**
- Tapping recent images button opens bottom-sheet popup covering ~75% of screen height
- Popup displays 6 image thumbnails in 3x2 grid from Recent Photos (loaded from AsyncStorage URIs)
- If fewer than 6 recent images, empty slots shown as gray placeholders
- 'X' button in top right dismisses popup without selection
- Tapping outside popup area or dragging popup down dismisses popup
- Popup header: "Recent Images"
- Tapping an image thumbnail places brand-blue 3px border around it with checkmark icon in bottom-right corner
- 'Select' button at bottom right of popup, becomes active only when an image is selected
- Tapping Select: closes popup, loads selected image as if just captured, navigates to Object Selection screen

**Testing Notes:** Test with 0, 3, and 6 recent images.
**Current Status:** Not Started
**Notes:** 

---

### 4.6 - Install Expo ImageManipulator for Compression
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 3.4  
**Description:** Install Expo ImageManipulator for on-device image compression before S3 upload.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- `expo-image-manipulator` package installed
- Compression function created that accepts image URI and returns compressed URI
- Compression settings: max 2048px on longest side, JPEG format, quality 0.9 (90%)
- EXIF data stripped during compression
**Current Status:** Not Started
**Notes:** 

---

### 4.7 - Implement Image Compression Before Upload
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 3.4, Section 9.3  
**Description:** Apply image compression before uploading saved color images to S3 (not for Recent Photos - only when user explicitly saves a color).  
**Dependencies:** 4.6  
**Acceptance Criteria:**
- Before calling S3 pre-signed PUT URL (task 5.7), compress image using ImageManipulator
- Compression flow: original URI → ImageManipulator.manipulateAsync() with resize to max 2048px, save as JPEG quality 0.9, strip EXIF → compressed URI
- Upload compressed image to S3, not original
- Original captured image in Recent Photos remains uncompressed

**Testing Notes:** Test with images >4000px and images <2048px. Verify 2048px images are not upscaled.
**Current Status:** Not Started
**Notes:** 

---

### 4.8 - Build Object Selection Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.5  
**Description:** Create Object Selection screen displaying captured image with tap-to-select functionality.  
**Dependencies:** 4.4  
**Acceptance Criteria:**
- Full-width display of captured image (or selected recent image)
- Top left: back arrow → returns to Find Color screen
- Instructional text below image: "Tap the object or area whose color you want to identify."
- Tapping anywhere on image places selection marker (Phase 1 logic in task 5.1)
- Screen displays loading indicator during color detection processing (Phase 1 and Phase 2)
**Current Status:** Not Started
**Notes:** 

---

## 5. COLOR DETECTION (PHASE 1 - EXACT POINT)

### 5.1 - Implement Exact Point Selection on Object Selection Screen
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.2.1, Section 5.5.2  
**Description:** Implement tap-to-place marker on Object Selection screen (Phase 1 only - no ML).  
**Dependencies:** 4.8  
**Acceptance Criteria:**
- User can tap anywhere on displayed image
- Tap coordinate (x, y) captured relative to image dimensions
- Visible marker placed at tapped coordinate: small circle (~16px diameter), brand-blue border, semi-transparent fill
- Marker position stored in state along with tap coordinates
- Navigation to Selection Confirmation screen after marker placement
**Current Status:** Not Started
**Notes:** 

---

### 5.2 - Build Selection Confirmation Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.6  
**Description:** Create Selection Confirmation screen showing image with selection marker and action buttons.  
**Dependencies:** 5.1  
**Acceptance Criteria:**
- Screen displays captured image with selection marker drawn on it
- Top left: back arrow → returns to Object Selection screen
- Below image: 'Confirm Selection' primary button
- Below that: 'Reselect' secondary button
- Phase 2 addition (task 17.4): 'Use exact point instead' tertiary button (not shown in Phase 1)
- Tapping Confirm Selection triggers color extraction (task 5.3)
- Tapping Reselect returns to Object Selection screen with image still displayed, no marker
**Current Status:** Not Started
**Notes:** 

---

### 5.3 - Implement 5x5 Pixel Averaging for Exact Point Extraction
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.2.2  
**Description:** Create client-side or Lambda function to extract 5×5 pixel area around tap coordinate and compute average RGB.  
**Dependencies:** 5.1  
**Acceptance Criteria:**
- Function accepts: image data (base64 or bitmap), tapX, tapY, imageWidth, imageHeight
- Extract 5×5 pixel area centered on (tapX, tapY) from image bitmap
- Handle edge cases: if tap is within 2 pixels of image edge, adjust extraction area to stay within bounds
- Compute average RGB across all pixels in extracted area: avgR = sum(R values) / 25, etc.
- Return average RGB as `{ r: number, g: number, b: number }`
- Function runs fast enough for real-time use (<100ms)

**Testing Notes:** Test corner and edge taps. Test with solid color image and gradient image.
**Current Status:** Not Started
**Notes:** 

---

### 5.4 - Implement RGB to LAB Conversion
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.2.2, Section 4.4.2  
**Description:** Create function to convert RGB color values to CIELAB (D65 illuminant).  
**Dependencies:** None (pure math function)  
**Acceptance Criteria:**
- Function accepts RGB object `{ r: 0-255, g: 0-255, b: 0-255 }`
- Converts RGB → XYZ → LAB using D65 illuminant standard formulas
- Returns LAB object `{ l: 0-100, a: -128-127, b: -128-127 }` with float precision
- Function handles edge cases (pure black, pure white, fully saturated colors)
- Unit tests cover at least 10 known RGB-to-LAB conversions (test against colorimetry reference data)

**Testing Notes:** Use online RGB-to-LAB converter to verify several test cases.
**Current Status:** Not Started
**Notes:** 

---

### 5.5 - Create DetectColor Lambda Function (Phase 1)
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.2, Section 10.4  
**Description:** Create Lambda function to extract color from image based on exact point coordinates (Phase 1).  
**Dependencies:** 2.2, 2.7, 2.8, 5.3, 5.4, 6.2 (LAB matching implemented)  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `POST /colors/detect`
- No Cognito authorization required (guest users can detect colors)
- Request body: `{ imageBase64: string, tapX: number, tapY: number, imageWidth: number, imageHeight: number }`
- Decode base64 image to bitmap
- Extract 5×5 pixel area at (tapX, tapY) using logic from task 5.3
- Compute average RGB
- Convert RGB to LAB using task 5.4 function
- Find nearest LAB match in Colors Master dataset using task 6.2 function
- Return `{ colorID, detailedColorName, familyColorName, hex, rgb, lab }`
- Logs to CloudWatch
- Response time <2 seconds per Section 13.2

**Testing Notes:** Test with various image sizes and tap positions. Verify LAB matching accuracy.
**Current Status:** Not Started
**Notes:** 

---

### 5.6 - Integrate DetectColor Lambda Call on Selection Confirmation
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 5.6.2  
**Description:** Call DetectColor Lambda when user taps Confirm Selection, then navigate to Color Results screen.  
**Dependencies:** 5.2, 5.5  
**Acceptance Criteria:**
- Tapping Confirm Selection shows loading indicator
- Convert captured image to base64
- Call `POST /colors/detect` with imageBase64, tapX, tapY, imageWidth, imageHeight
- On success: store color data in state, navigate to Color Results screen
- On failure: show error banner "Could not identify a color. Please try again." with Retry button (task 12.1)
- Retry button re-triggers DetectColor call
- Loading indicator dismisses on success or failure
**Current Status:** Not Started
**Notes:** 

---

## 6. COLOR NAMING SYSTEM

### 6.1 - Research and Select Color Dataset
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.4.1, Section 8.3.1 Note  
**Description:** Evaluate candidate color datasets (colornames npm, ntc library, others) and select one for Colors Master database.  
**Dependencies:** None  
**Acceptance Criteria:**
- At least 3 candidate datasets evaluated
- Evaluation criteria documented: number of colors, LAB diversity, family classification availability, license compatibility, dataset quality
- Selected dataset contains 20,000+ named colors with good perceptual distribution
- Dataset includes or can be augmented with familyColorName classification (Red, Yellow, Blue, etc.)
- Decision documented with rationale in project docs
**Current Status:** Not Started
**Notes:** 

---

### 6.2 - Create Script to Precompute LAB Values and Format Dataset
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.4.1, Section 8.3.1  
**Description:** Write script to process selected color dataset, compute LAB values for each color, and format as JSON for DynamoDB import.  
**Dependencies:** 6.1, 5.4 (RGB to LAB function)  
**Acceptance Criteria:**
- Script accepts color dataset in its native format (CSV, JSON, etc.)
- For each color: extract hex, convert hex to RGB, convert RGB to LAB using task 5.4 function
- Assign familyColorName based on hue analysis (or use dataset's provided family if available)
- Generate UUID for each color as colorID
- Output JSON array of objects: `{ colorID, hex, rgb: {r,g,b}, lab: {l,a,b}, detailedColorName, familyColorName }`
- Script is idempotent and deterministic (same input produces same output)
- Output saved to file: `colors-master-dataset.json`
**Current Status:** Not Started
**Notes:** 

---

### 6.3 - Seed Colors Master DynamoDB Table
**Assignee:** Database - Amy  
**PDR Reference:** Section 8.3.1  
**Description:** Import formatted color dataset into colorfind-colors-master DynamoDB table.  
**Dependencies:** 2.2, 6.2  
**Acceptance Criteria:**
- Script or AWS CLI command written to batch import JSON from task 6.2 into DynamoDB
- Table seeded in both dev and prod environments
- All records successfully imported (verify count matches source dataset)
- Random sampling of 10 colors verified in DynamoDB Console
- GSI `familyColorName` populated correctly
**Current Status:** Not Started
**Notes:** 

---

### 6.4 - Implement DeltaE (CIE2000) Distance Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.4.2  
**Description:** Implement DeltaE CIE2000 color distance formula for perceptually uniform color matching.  
**Dependencies:** None (pure math function)  
**Acceptance Criteria:**
- Function accepts two LAB objects: `lab1: {l,a,b}`, `lab2: {l,a,b}`
- Calculates and returns DeltaE (CIE2000) distance as float
- Function uses standard CIE2000 formula (consider using existing library like `delta-e` npm package)
- Unit tests verify correctness against published DeltaE test cases
- Function optimized for performance (will be called thousands of times per color detection)

**Testing Notes:** Use online DeltaE calculator or published test vectors to verify implementation.
**Current Status:** Not Started
**Notes:** 

---

### 6.5 - Implement LAB Nearest-Neighbor Matching Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.4.2, Section 8.3.2  
**Description:** Implement function to find closest color in Colors Master dataset to a given LAB value using DeltaE.  
**Dependencies:** 6.4  
**Acceptance Criteria:**
- Function accepts query LAB value: `{ l, a, b }`
- Function accepts Colors Master dataset array (loaded from DynamoDB or cached in memory)
- Iterates through all colors in dataset, calculates DeltaE between query and each color using task 6.4 function
- Returns color with minimum DeltaE (closest match)
- Returns full color object: `{ colorID, hex, rgb, lab, detailedColorName, familyColorName }`
- Function completes in <1 second for 30,000 color dataset
- Lambda caches Colors Master dataset in memory between invocations to avoid repeated DynamoDB queries

**Testing Notes:** Test with several known colors (pure red, pure blue, mid-gray) and verify intuitive matches.
**Current Status:** Not Started
**Notes:** 

---

## 7. UI SCREENS - COLOR RESULTS & THEMES

### 7.1 - Build Color Results Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.7  
**Description:** Create Color Results screen displaying detected color information, image, and action buttons.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Screen is scrollable
- Top left: back arrow → returns to Selection Confirmation screen
- Captured image displayed at full width at top
- Color swatch: rounded rectangle (8px radius, thin border), filled with detected color hex
- Detailed color name displayed in large text (e.g., "Quercitron")
- Family color name in smaller subtext (e.g., "Yellow")
- HEX value with '#' prefix (e.g., "#E5A100")
- RGB values displayed (e.g., "R: 229  G: 161  B: 0")
- LAB values displayed (e.g., "L: 68.4  A: 12.1  B: 61.8")
- 'Save Color' button (functionality in task 8.1)
- 'Compare Color' button (functionality in task 10.1)
- Color Themes section placeholder (populated in task 7.5)
- Save Color button disabled state after color is saved (set in task 8.2)
**Current Status:** Not Started
**Notes:** 

---

### 7.2 - Implement Color Themes Generation - Complementary
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 7.2  
**Description:** Implement algorithm to generate complementary color theme (5 swatches) from detected color.  
**Dependencies:** None (client-side computation)  
**Acceptance Criteria:**
- Function accepts source color hex value
- Converts hex to HSL/HSV color space
- Rotates hue by 180° to find complementary base hue
- Generates 5 swatches evenly distributed around complementary hue (e.g., 180°, 170°, 190°, 160°, 200°)
- Returns array of 5 hex values
- Function runs client-side (no backend call)

**Testing Notes:** Verify complementary colors visually appear opposite on color wheel.
**Current Status:** Not Started
**Notes:** 

---

### 7.3 - Implement Color Themes Generation - Analogous
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 7.2  
**Description:** Implement algorithm to generate analogous color theme (5 swatches) from detected color.  
**Dependencies:** None  
**Acceptance Criteria:**
- Function accepts source color hex value
- Converts hex to HSL/HSV
- Generates 5 swatches by rotating hue: source, +15°, -15°, +30°, -30°
- Returns array of 5 hex values
- Function runs client-side

**Testing Notes:** Verify analogous colors appear adjacent on color wheel (harmonious palette).
**Current Status:** Not Started
**Notes:** 

---

### 7.4 - Implement Color Themes Generation - Triadic
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 7.2  
**Description:** Implement algorithm to generate triadic color theme (5 swatches) from detected color.  
**Dependencies:** None  
**Acceptance Criteria:**
- Function accepts source color hex value
- Converts hex to HSL/HSV
- Generates 3 anchor colors at 0°, 120°, 240° hue offsets
- Produces 5 swatches from these anchors (e.g., source, +120°, +240°, +60°, +180°)
- Returns array of 5 hex values
- Function runs client-side

**Testing Notes:** Verify triadic colors are evenly spaced and create balanced palette.
**Current Status:** Not Started
**Notes:** 

---

### 7.5 - Display Color Themes on Color Results Screen
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 7.3  
**Description:** Render color themes section on Color Results screen showing all three theme types.  
**Dependencies:** 7.1, 7.2, 7.3, 7.4  
**Acceptance Criteria:**
- Color Themes section displays three labeled subsections: "Complementary", "Analogous", "Triadic"
- Each subsection shows 5 color swatches in horizontal row
- Each swatch: rounded rectangle filled with theme color
- Hex value displayed below each swatch in small text
- Themes generated client-side when Color Results screen loads
- Swatches are non-interactive (no tap behavior) in MVP
- All three themes always visible (not collapsible or selectable)
**Current Status:** Not Started
**Notes:** 

---

### 7.6 - Display Color Themes on Saved Color Detail Screen
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 7.1, Section 5.10  
**Description:** Render identical color themes section on Saved Color Detail screen.  
**Dependencies:** 7.5, 9.1 (Saved Color Detail screen built)  
**Acceptance Criteria:**
- Saved Color Detail screen includes identical Color Themes section as Color Results screen
- Themes generated from saved color's hex value when screen loads
- Layout and behavior identical to task 7.5
**Current Status:** Not Started
**Notes:** 

---

## 8. SAVED COLORS - SAVE FLOW

### 8.1 - Build Save Color Prompt Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.8  
**Description:** Create Save Color Prompt screen where user assigns a name to the color before saving.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Top left: back arrow → returns to Color Results screen without saving
- Instructional text: "Give this color a name."
- Text input field pre-filled with detailedColorName as suggestion
- User can tap field, clear suggestion, and type custom name
- 'Save' primary button
- Save button disabled if input field is empty
- Empty field validation: if empty and Save tapped → inline error "Please enter a name for this color."
**Current Status:** Not Started
**Notes:** 

---

### 8.2 - Create GenerateUploadURL Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.4, Section 10.4, Section 9.3  
**Description:** Create Lambda function to generate pre-signed S3 PUT URL for image upload.  
**Dependencies:** 2.4, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `POST /images/upload-url`
- Requires Cognito authorization
- Request body: `{ objectID: string, userID: string }`
- Validates userID in body matches userID from Cognito token (ownership check)
- Generates pre-signed S3 PUT URL for key: `users/{userID}/saved/{objectID}.jpg`
- URL expires in 5 minutes
- Returns `{ uploadUrl: string, s3Key: string }`
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 8.3 - Create SaveColor Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.3, Section 10.4  
**Description:** Create Lambda function to write saved color record to Reference Objects table.  
**Dependencies:** 2.3, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `POST /colors/saved`
- Requires Cognito authorization
- Request body: `{ objectID, colorID, imageS3Key, familyColorName, detailedColorName, hex, rgb, lab, userAssignedName }`
- Validates userID from token matches the userID for which record is being created
- Generates createdAt ISO 8601 timestamp
- Writes record to Reference Objects table with all denormalized color metadata
- Returns `{ success: boolean, objectID }`
- Handles DynamoDB write failures with retry logic (Section 12.1)
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 8.4 - Implement Save Color Flow
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 5.8.2, Section 9.3  
**Description:** Implement complete save flow: compress image, upload to S3, write DB record, navigate back to Color Results.  
**Dependencies:** 4.7 (compression), 8.1, 8.2, 8.3  
**Acceptance Criteria:**
- Tapping Save on Save Color Prompt screen triggers save flow
- Show loading indicator during entire flow
- Step 1: Compress image using task 4.7 logic (2048px max, JPEG 90%, strip EXIF)
- Step 2: Generate UUID for objectID
- Step 3: Call `POST /images/upload-url` with objectID and userID
- Step 4: Upload compressed image directly to S3 using returned pre-signed PUT URL
- Step 5: On successful S3 upload (HTTP 200), call `POST /colors/saved` with all color metadata, imageS3Key, and userAssignedName
- Step 6: On successful DB write, navigate back to Color Results screen
- Step 7: Show success toast "Color saved!"
- Step 8: Disable Save Color button on Color Results screen (prevent duplicate saves)
- Handle failures at each step: if S3 upload fails → show error banner with Retry (Section 12.2), if DB write fails → show error banner with Retry

**Testing Notes:** Test with slow/unreliable network. Test retry logic for S3 and DB failures.
**Current Status:** Not Started
**Notes:** 

---

## 9. SAVED COLORS - LIST & DETAIL SCREENS

### 9.1 - Build Saved Colors Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.9  
**Description:** Create Saved Colors screen (bottom tab right) with search, filters, and grid of saved color cards.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Top right: circular user icon → navigates to User Settings
- Search bar at top: placeholder text "Search saved colors..."
- Color family filter bar below search: horizontal scrollable row of chips ("All", "Red", "Yellow", "Blue", "Green", "Orange", "Purple", "Brown", "Gray", "Black", "White")
- "All" chip selected by default
- Scrollable grid of saved color cards below filters
- Each card shows: saved image thumbnail (rounded rectangle), user-assigned name, family name
- Empty state (if no saved colors): illustration placeholder and text "No saved colors yet. Capture a color to get started!"
- Bottom navigation bar: right = bookmark icon (active/highlighted), left = color dropper icon (inactive)
- Guest users redirected to Sign In per task 3.11
**Current Status:** Not Started
**Notes:** 

---

### 9.2 - Create GetSavedColors Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.3, Section 10.4  
**Description:** Create Lambda function to retrieve all saved colors for authenticated user with optional filters.  
**Dependencies:** 2.3, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `GET /colors/saved?familyFilter={string}&searchQuery={string}`
- Requires Cognito authorization
- Extracts userID from Cognito token
- If familyFilter provided: query userID-family-index GSI with userID and familyColorName
- If no filter: query Reference Objects table by userID (partition key scan)
- If searchQuery provided: filter results client-side by matching searchQuery against userAssignedName (case-insensitive partial match)
- Return array of color objects sorted by createdAt descending (newest first)
- Each object includes all fields from Reference Objects table
- Logs to CloudWatch
- Response time <1 second for 100 saved colors

**Testing Notes:** Test with 0, 1, 10, 100 saved colors. Test family filter and search combinations.
**Current Status:** Not Started
**Notes:** 

---

### 9.3 - Create GetImageURL Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.4, Section 10.4, Section 9.4  
**Description:** Create Lambda function to generate pre-signed S3 GET URL for viewing saved color images.  
**Dependencies:** 2.4, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `GET /images/view-url?s3Key={string}`
- Requires Cognito authorization
- Validates s3Key starts with `users/{userID}/` where userID matches token (ownership check)
- Generates pre-signed S3 GET URL for requested s3Key
- URL expires in 1 hour
- Returns `{ viewUrl: string }`
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 9.4 - Implement Saved Colors List Retrieval
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 5.9.2  
**Description:** Call GetSavedColors Lambda on Saved Colors screen mount and display results in grid.  
**Dependencies:** 9.1, 9.2  
**Acceptance Criteria:**
- On Saved Colors screen mount, call `GET /colors/saved` (no filters initially)
- Show loading skeleton while API call in progress
- On success: render grid of color cards
- For each card, display saved image thumbnail (fetched via pre-signed URL from task 9.5), userAssignedName, familyColorName
- If response array empty: show empty state
- Handle API errors gracefully (show error message)
**Current Status:** Not Started
**Notes:** 

---

### 9.5 - Implement Image Loading with Pre-Signed URLs
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 9.4  
**Description:** For each saved color displayed, generate pre-signed S3 GET URL and load image.  
**Dependencies:** 9.3, 9.4  
**Acceptance Criteria:**
- For each saved color in grid, call `GET /images/view-url?s3Key={imageS3Key}` to get pre-signed URL
- Cache pre-signed URL in memory for session to avoid repeated Lambda calls for same image
- Use pre-signed URL as image source for thumbnail
- Show loading placeholder while image loading
- Handle image load failures gracefully (show placeholder icon)
- Pre-signed URLs refresh after 1 hour (re-fetch if needed)

**Testing Notes:** Test with many saved colors (50+) to verify performance and caching.
**Current Status:** Not Started
**Notes:** 

---

### 9.6 - Implement Search Functionality
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.9.1, Clarification Answer  
**Description:** Implement real-time search filtering on Saved Colors screen by userAssignedName, familyColorName, and detailedColorName.  
**Dependencies:** 9.4  
**Acceptance Criteria:**
- User typing in search bar triggers filtering with debounce (300ms delay)
- Search matches against: userAssignedName, familyColorName, detailedColorName
- Search is case-insensitive partial match (e.g., "yell" matches "Yellow" and "Yellowish")
- Grid updates in real-time to show only matching colors
- If no matches: show empty state with "No colors match your search."
- Clearing search bar restores full list

**Testing Notes:** Partial match is implemented. Fuzzy match can be added as future feature if time permits.
**Current Status:** Not Started
**Notes:** 

---

### 9.7 - Implement Color Family Filter
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.9.1  
**Description:** Implement color family filter chip selection on Saved Colors screen.  
**Dependencies:** 9.4  
**Acceptance Criteria:**
- Tapping a family chip (e.g., "Red") filters grid to show only colors where familyColorName matches
- Selected chip highlighted with brand-blue background
- "All" chip removes filter and shows all colors
- Only one family filter active at a time
- Filter can be combined with search (apply both filters)
- Call `GET /colors/saved?familyFilter={family}` when family chip tapped (backend filtering via GSI)

**Testing Notes:** Test filter combinations with search. Verify GSI usage for efficient filtering.
**Current Status:** Not Started
**Notes:** 

---

### 9.8 - Build Saved Color Detail Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.10  
**Description:** Create Saved Color Detail screen showing full details of a saved color with edit and delete options.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Top left: back arrow → returns to Saved Colors screen
- Original saved image displayed at full width
- Color swatch (8px radius rounded rectangle)
- User-assigned name with pencil edit icon to its right
- Detailed color name
- Family color name
- HEX, RGB, LAB values
- 'Compare Color' button
- 'Delete Color' button (red/destructive styling)
- Color Themes section (populated in task 7.6)
**Current Status:** Not Started
**Notes:** 

---

### 9.9 - Implement Navigation to Saved Color Detail
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.9.2  
**Description:** Tapping a saved color card navigates to Saved Color Detail screen with color data.  
**Dependencies:** 9.1, 9.8  
**Acceptance Criteria:**
- Tapping a color card in grid navigates to Saved Color Detail screen
- Pass full color object (including imageS3Key) to detail screen via navigation params
- Detail screen loads image using pre-signed URL (same logic as task 9.5)
- All color metadata displayed on detail screen
**Current Status:** Not Started
**Notes:** 

---

### 9.10 - Create RenameColor Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.3, Section 10.4  
**Description:** Create Lambda function to update userAssignedName for a saved color.  
**Dependencies:** 2.3, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `PATCH /colors/saved/{objectID}`
- Requires Cognito authorization
- Request body: `{ userAssignedName: string }`
- Validates userID from token owns the objectID (query Reference Objects table by userID+objectID, verify exists)
- Updates userAssignedName field in Reference Objects table
- Returns `{ success: boolean }`
- Handles DynamoDB update failures with retry logic
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 9.11 - Implement Rename Functionality on Detail Screen
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 5.10.2  
**Description:** Implement pencil icon tap to open rename modal and update saved color name.  
**Dependencies:** 9.8, 9.10  
**Acceptance Criteria:**
- Tapping pencil icon opens modal or inline edit field
- Current userAssignedName pre-filled in text input
- User edits name and taps Save/Confirm
- Validation: name must not be empty → inline error if empty
- Call `PATCH /colors/saved/{objectID}` with new userAssignedName
- On success: update displayed name on detail screen, show success toast "Name updated!"
- On failure: show error banner with Retry
- Modal dismisses on successful update
**Current Status:** Not Started
**Notes:** 

---

### 9.12 - Create DeleteColor Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.3, Section 10.4  
**Description:** Create Lambda function to delete saved color record and associated S3 image.  
**Dependencies:** 2.3, 2.4, 2.7, 2.8  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `DELETE /colors/saved/{objectID}`
- Requires Cognito authorization
- Validates userID from token owns the objectID
- Orchestrates deletion:
  1. Delete Reference Objects record for userID + objectID
  2. Delete S3 object at imageS3Key (extracted from record before deletion)
- Returns `{ success: boolean }`
- Handles partial failures (log error if S3 delete fails after DB delete, but still return success)
- Logs to CloudWatch

**Testing Notes:** Test S3 delete failure scenario (e.g., image already deleted). Verify orphaned S3 objects don't accumulate.
**Current Status:** Not Started
**Notes:** 

---

### 9.13 - Implement Delete Functionality on Detail Screen
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 5.10.3  
**Description:** Implement delete confirmation dialog and deletion logic on Saved Color Detail screen.  
**Dependencies:** 9.8, 9.12  
**Acceptance Criteria:**
- Tapping Delete Color button shows confirmation dialog: "Are you sure you want to delete this color? This cannot be undone."
- Dialog has Cancel and Delete buttons
- Tapping Delete calls `DELETE /colors/saved/{objectID}`
- Show loading indicator during deletion
- On success: navigate back to Saved Colors screen, show toast "Color deleted!"
- On failure: show error banner with Retry
- Deleted color immediately removed from Saved Colors grid when user returns

**Testing Notes:** Test deleting the only saved color. Test deleting while offline.
**Current Status:** Not Started
**Notes:** 

---

## 10. COLOR COMPARISON ENGINE

### 10.1 - Build Compare Screen UI
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.11  
**Description:** Create Compare Screen with side-by-side color panels, sliders, similarity score, and text summary.  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- Top left: back arrow → returns to launching screen (Color Results or Saved Color Detail)
- Left panel: displays source color (image, swatch, names, hex, rgb, lab)
- Right panel: initially shows "Select a color to compare" placeholder
- After selection: right panel displays comparison color (image, swatch, names, hex, rgb, lab)
- Comparison sliders section (hidden until comparison color selected)
- Similarity score section (hidden until comparison color selected)
- Text summary section (hidden until comparison color selected)
- Tapping right panel after selection re-opens color selection popup
**Current Status:** Not Started
**Notes:** 

---

### 10.2 - Build Color Selection Popup for Comparison
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.11.2  
**Description:** Create bottom-sheet popup for selecting a comparison color from saved colors.  
**Dependencies:** 10.1  
**Acceptance Criteria:**
- Bottom-sheet popup covers ~75% of screen height
- 'X' button in top right dismisses popup
- Tapping outside popup or dragging down dismisses popup
- Popup header: "Select a color to compare"
- Inside popup: full saved colors view with search bar, family filter chips, scrollable grid
- Tapping a color card places brand-blue 3px border with checkmark in bottom-right corner
- 'Select' button at bottom right, active only when a color is selected
- Tapping Select: closes popup, loads selected color into right panel, triggers comparison calculations (task 10.3)

**Testing Notes:** Reuses saved colors display logic from task 9.1.
**Current Status:** Not Started
**Notes:** 

---

### 10.3 - Implement CIELAB Comparison Calculations
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 6.2, Section 6.3  
**Description:** Create functions to compute all comparison metrics: DeltaE, lightness, hue, chroma, similarity percentage.  
**Dependencies:** 6.4 (DeltaE function)  
**Acceptance Criteria:**
- Function accepts two LAB objects: `sourceColor: {l,a,b}`, `compareColor: {l,a,b}`
- Calculate metrics:
  - DeltaE (CIE2000) using task 6.4 function
  - Lightness (L values directly)
  - A channel (red/green)
  - B channel (yellow/blue)
  - Chroma for each color: √(A² + B²)
- Calculate similarity percentage: `max(0, 100 - (deltaE * 2))`
- Return object: `{ deltaE, lightnessSource, lightnessCompare, aSource, aCompare, bSource, bCompare, chromaSource, chromaCompare, similarityPercent }`
**Current Status:** Not Started
**Notes:** 

---

### 10.4 - Build Comparison Sliders Display
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 6.2  
**Description:** Create non-interactive display sliders showing both colors' positions on each metric scale.  
**Dependencies:** 10.1, 10.3  
**Acceptance Criteria:**
- Four sliders rendered after comparison color selected
- Slider 1: Lightness (L) — scale 0 (Black) to 100 (White), two indicator marks for source and compare colors
- Slider 2: Red ↔ Green (A) — scale -128 (Green) to +127 (Red), two indicator marks
- Slider 3: Yellow ↔ Blue (B) — scale -128 (Blue) to +127 (Yellow), two indicator marks
- Slider 4: Saturation/Chroma — scale 0 (Gray) to ~180 (Max vivid), two indicator marks
- Each slider has gradient track visually representing the color range
- Each slider labeled with metric name
- Indicator marks clearly distinguished (different colors or shapes for source vs compare)
- Sliders are non-interactive (display only, user cannot drag)
**Current Status:** Not Started
**Notes:** 

---

### 10.5 - Display Similarity Score
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 6.3  
**Description:** Display similarity percentage prominently on Compare Screen after comparison color selected.  
**Dependencies:** 10.1, 10.3  
**Acceptance Criteria:**
- Similarity score displayed as large percentage number (e.g., "74%")
- Label "Match" or "Similarity" below percentage
- Calculation per Section 6.3: `max(0, 100 - (deltaE * 2))`
- Score updates when different comparison color selected
**Current Status:** Not Started
**Notes:** 

---

### 10.6 - Create Comparison Threshold Constants Configuration File
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 6.4  
**Description:** Create configuration file defining all comparison text thresholds as named constants.  
**Dependencies:** None  
**Acceptance Criteria:**
- File created: `src/config/comparisonThresholds.ts`
- Defines constants for:
  - Lightness (ΔL): 0-3, 3-10, 10-25, 25+
  - Hue (ΔA and ΔB): 0-3, 3-10, 10-20, 20+
  - Chroma (ΔChroma): 0-5, 5-15, 15+
- Each threshold has descriptive constant name (e.g., `LIGHTNESS_SLIGHT_MIN = 3`, `LIGHTNESS_NOTICEABLE_MIN = 10`)
- Constants exported and imported by comparison text generation function (task 10.7)
- No hardcoded threshold values in business logic
**Current Status:** Not Started
**Notes:** 

---

### 10.7 - Implement Auto-Generated Comparison Text Summary
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 6.4  
**Description:** Generate natural-language summary of color differences based on calculated metrics and thresholds.  
**Dependencies:** 10.3, 10.6  
**Acceptance Criteria:**
- Function accepts comparison metrics object from task 10.3
- Calculates differences: ΔL, ΔA, ΔB, ΔChroma
- Uses thresholds from task 10.6 to determine descriptors (e.g., "slightly", "noticeably", "much")
- Constructs sentence mentioning only dimensions that meet minimum threshold
- Source color is subject of sentence
- Example outputs:
  - "Quercitron is slightly darker and significantly more yellow than Cobalt Blue."
  - "Amaranth Pink is virtually the same brightness but noticeably more red and slightly more vivid than Sage."
  - "These colors are very similar." (if all differences below thresholds)
- Returns summary string

**Testing Notes:** Test with several color pairs (similar colors, very different colors, complementary colors).
**Current Status:** Not Started
**Notes:** 

---

### 10.8 - Display Comparison Text Summary
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.11.1, Section 6.4.4  
**Description:** Display auto-generated text summary on Compare Screen after comparison color selected.  
**Dependencies:** 10.1, 10.7  
**Acceptance Criteria:**
- Text summary displayed below similarity score and sliders
- Summary generated using task 10.7 function
- Text rendered in readable paragraph format
- Summary updates when different comparison color selected
**Current Status:** Not Started
**Notes:** 

---

### 10.9 - Implement Navigation to Compare Screen from Color Results
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.7.2  
**Description:** Tapping Compare Color button on Color Results screen navigates to Compare Screen with source color.  
**Dependencies:** 7.1, 10.1  
**Acceptance Criteria:**
- Tapping Compare Color button on Color Results screen navigates to Compare Screen
- Source color (left panel) populated with detected color data
- Right panel shows "Select a color to compare" placeholder
- Guest users redirected to Sign In per task 3.11
**Current Status:** Not Started
**Notes:** 

---

### 10.10 - Implement Navigation to Compare Screen from Saved Color Detail
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.10.1  
**Description:** Tapping Compare Color button on Saved Color Detail screen navigates to Compare Screen with source color.  
**Dependencies:** 9.8, 10.1  
**Acceptance Criteria:**
- Tapping Compare Color button on Saved Color Detail screen navigates to Compare Screen
- Source color (left panel) populated with saved color data
- Right panel shows "Select a color to compare" placeholder
**Current Status:** Not Started
**Notes:** 

---

## 11. ERROR HANDLING & RETRY LOGIC

### 11.1 - Implement Exponential Backoff Retry Logic for Network Requests
**Assignee:** API - Sean  
**PDR Reference:** Section 12.1  
**Description:** Create reusable retry wrapper function for all API Gateway and S3 requests with exponential backoff.  
**Dependencies:** None (utility function)  
**Acceptance Criteria:**
- Utility function created: `retryWithBackoff(apiCall, maxRetries = 3)`
- Retry strategy: 1 second delay after attempt 1, 2 seconds after attempt 2, 4 seconds after attempt 3
- Only retries 5xx server errors and network timeouts
- Does not retry 4xx client errors (validation failures, authentication errors)
- Returns promise that resolves with successful response or rejects after max retries
- All API calls in app (tasks 3.4, 3.5, 5.6, 8.4, 9.4, etc.) wrapped with this function
**Current Status:** Not Started
**Notes:** 

---

### 11.2 - Build Retry Error Banner Component
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.1  
**Description:** Create reusable error banner component that displays error message with Retry button.  
**Dependencies:** None  
**Acceptance Criteria:**
- Component accepts props: `message: string`, `onRetry: function`, `visible: boolean`
- Banner displays at top of screen (above current content, not blocking)
- Red/error styling with white text
- Retry button on right side of banner
- Tapping Retry button calls `onRetry` function
- Banner dismissible with X button on right
- Component reusable across all screens
**Current Status:** Not Started
**Notes:** 

---

### 11.3 - Implement Camera Permission Denied Error Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Already implemented in task 4.3. Verify implementation matches error handling spec.  
**Dependencies:** 4.3  
**Acceptance Criteria:**
- Verify modal message matches Section 12.2: "Camera access is required to use Colorfind. Please enable camera access in your device settings."
- Verify "Open Settings" button deep-links to device settings via `Linking.openSettings()`
- Modal non-dismissible until permission granted
**Current Status:** Not Started
**Notes:** 

---

### 11.4 - Implement Image Upload Failure Error Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Handle S3 upload failures in save color flow (task 8.4) with error banner and retry.  
**Dependencies:** 8.4, 11.2  
**Acceptance Criteria:**
- If S3 PUT request fails after 3 retries (task 11.1), show error banner on Save Color Prompt screen
- Banner message: "Upload failed. Please check your connection and try again."
- Retry button re-triggers save flow from image compression step (task 8.4)
- Image retained in local temp storage for retry (do not re-compress if retry)
- DB record not written until S3 upload succeeds
**Current Status:** Not Started
**Notes:** 

---

### 11.5 - Implement DB Write Failure Error Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Handle DynamoDB write failures for save color, rename, and delete operations.  
**Dependencies:** 8.4, 9.11, 9.13, 11.2  
**Acceptance Criteria:**
- Save color DB write failure (task 8.4): show error banner "Could not save your color. Please try again." with Retry
- Rename DB write failure (task 9.11): show error banner "Could not update name. Please try again." with Retry
- Delete DB write failure (task 9.13): show error banner "Could not delete this color. Please try again." with Retry
- Each Retry button re-triggers respective operation
- No partial state shown to user (e.g., don't add color to saved list until DB write confirmed)
**Current Status:** Not Started
**Notes:** 

---

### 11.6 - Implement Color Detection Failure Error Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Handle DetectColor Lambda failures (task 5.6) with error banner and retry.  
**Dependencies:** 5.6, 11.2  
**Acceptance Criteria:**
- If DetectColor API call fails after 3 retries, show error banner on Selection Confirmation screen
- Banner message: "Could not identify a color. Please try again."
- Retry button re-triggers DetectColor API call with same image and tap coordinates
- User can also tap Reselect to return to Object Selection screen
**Current Status:** Not Started
**Notes:** 

---

### 11.7 - Implement Session Token Expiration Handling
**Assignee:** API - Sean, Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Implement automatic token refresh and redirect to Sign In on refresh failure.  
**Dependencies:** 1.3 (Amplify Auth configured)  
**Acceptance Criteria:**
- Amplify Auth automatically attempts to refresh tokens when expired (default behavior)
- API interceptor detects 401 responses and triggers refresh
- On successful refresh: retry original API call transparently (user unaware)
- On refresh failure (refresh token expired): clear session, navigate to Sign In screen, show message "Your session has expired. Please sign in again."
- Session expiration does not cause data loss (unsaved work should be preserved where possible)
**Current Status:** Not Started
**Notes:** 

---

### 11.8 - Implement Authentication Failure Error Handling
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 12.2  
**Description:** Handle sign-in failures (task 3.4) and sign-up failures (task 3.5) with inline errors.  
**Dependencies:** 3.4, 3.5  
**Acceptance Criteria:**
- Sign-in failure: inline error below password field "Incorrect username or password."
- Sign-up username taken: inline error below username field "That username is already in use. Please choose a different username."
- Sign-up password too short: inline error below password field "Password must be at least 8 characters."
- Errors display immediately after validation failure
- Errors clear when user edits respective field
- No exponential backoff for authentication errors (user must correct input)
**Current Status:** Not Started
**Notes:** 

---

## 12. ANALYTICS & LEGAL

### 12.1 - Configure Amplify Analytics with Pinpoint
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 14.1  
**Description:** Configure AWS Amplify Analytics to send anonymous usage events to Amazon Pinpoint.  
**Dependencies:** 1.3  
**Acceptance Criteria:**
- Amplify Analytics initialized in app entry point
- Pinpoint project created in both dev and prod AWS accounts
- Analytics configuration set to send events to Pinpoint
- No PII attached to any events (no userID, username, or image content)
- Events include only: event name, anonymous session ID, timestamp, device platform (iOS/Android)
**Current Status:** Not Started
**Notes:** 

---

### 12.2 - Implement Analytics Event Tracking
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 14.1.1  
**Description:** Implement all analytics event tracking throughout the app per Section 14.1.1.  
**Dependencies:** 12.1  
**Acceptance Criteria:**
- Events tracked:
  - `app_open`: on app launch
  - `color_detected`: after successful color detection, include attribute `method: "exact_point"` (Phase 1)
  - `color_saved`: after successful save to Reference Objects table
  - `color_compared`: when comparison calculations run on Compare Screen
  - `color_deleted`: after successful delete from Reference Objects table
  - `theme_viewed`: when Color Themes section displayed on Color Results or Saved Color Detail screen
  - `account_created`: after successful account creation
  - `guest_session_started`: when user taps Continue as Guest
- All events fire via `Analytics.record()` from Amplify Analytics
- Events logged to console in dev environment for debugging
- No PII in any event attributes

**Testing Notes:** Verify events appear in Pinpoint console for both dev and prod environments.
**Current Status:** Not Started
**Notes:** 

---

### 12.3 - Write Terms of Service and Privacy Policy Text
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 14.2, Section 14.3  
**Description:** Write final Terms of Service and Privacy Policy text to be displayed in app (task 3.3).  
**Dependencies:** None  
**Acceptance Criteria:**
- Privacy Policy includes all items from Section 14.2:
  - What is collected: username, saved color data, images user explicitly saves, anonymous usage analytics
  - What is NOT collected: email, real name, device identifiers, location, biometrics
  - How data is used: color identification, personal library, analytics for improvement only (never sold/shared)
  - Image privacy: stored privately in AWS S3, accessible only to owning account
  - Data deletion: deleting account permanently and immediately removes all data
  - No contact email (future feature - omit from MVP text)
- Terms of Service includes all items from Section 14.3:
  - App provided as-is, no guarantee of color accuracy for professional/safety-critical use
  - No unlawful use
  - User retains image ownership, grants ASARA limited storage license
  - ASARA may update Terms at any time, continued use = acceptance
- Text written in plain language, readable by general audience (no legal jargon)
- Text provided to task 3.3 for UI implementation
**Current Status:** Not Started
**Notes:** 

---

### 12.4 - Implement Guest Session Data Cleanup on App Close
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 2.2, Section 14.5  
**Description:** Delete Recent Photos when guest user closes app.  
**Dependencies:** 4.4  
**Acceptance Criteria:**
- Implement app state listener using `AppState` from React Native
- When app state changes to 'background' or 'inactive' AND user is in guest mode: delete all Recent Photos files from filesystem and clear Recent Photos index from AsyncStorage
- Cleanup runs silently (no user notification)
- Cleanup does NOT run for authenticated users (their Recent Photos persist)
**Current Status:** Not Started
**Notes:** 

---

## 13. PHASE 1 FINAL TESTING & POLISH

### 13.1 - Comprehensive End-to-End Testing - Phase 1 Features
**Assignee:** Full Stack Frontend - Alex, Full Stack Backend - Adam, API - Sean  
**PDR Reference:** All Phase 1 sections  
**Description:** Conduct full end-to-end testing of all Phase 1 features on both iOS and Android.  
**Dependencies:** All Phase 1 tasks (1.1 through 12.4)  
**Acceptance Criteria:**
- Test all user flows:
  - Guest flow: open app → Continue as Guest → capture image → detect color → view themes → exit (verify data deleted)
  - Authenticated flow: create account → capture → detect → save → view saved colors → rename → delete → sign out → sign back in (verify saved colors persist)
  - Comparison flow: save 2 colors → compare → verify sliders, score, text summary
- Test error scenarios: no internet, camera denied, API failures, token expiration
- Test on physical iOS device (minimum iOS 14)
- Test on physical Android device (minimum Android 10)
- All acceptance criteria from individual tasks verified
- No critical bugs (app crashes, data loss, broken navigation)
- Known minor bugs documented in issue tracker

**Testing Notes:** This is a manual QA pass. Automated E2E tests can be added post-MVP.
**Current Status:** Not Started
**Notes:** 

---

### 13.2 - Performance Optimization - Color Detection
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 13.2  
**Description:** Optimize DetectColor Lambda to meet <2 second response time target.  
**Dependencies:** 5.5  
**Acceptance Criteria:**
- DetectColor Lambda response time <2 seconds for typical image sizes (2048px)
- Lambda cold start time <3 seconds
- Colors Master dataset cached in Lambda memory between invocations (loaded once per Lambda instance)
- Image processing optimized (consider using smaller image resolution for color extraction if needed)
- Load testing performed with 10 concurrent requests to verify performance under load
**Current Status:** Not Started
**Notes:** 

---

### 13.3 - Performance Optimization - App Cold Start
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 13.2  
**Description:** Optimize app cold start time to meet <3 second target.  
**Dependencies:** All Phase 1 tasks  
**Acceptance Criteria:**
- App cold start (launch to Sign In screen) <3 seconds on mid-range device (e.g., iPhone 11, Google Pixel 5)
- Unnecessary imports removed (tree-shaking enabled)
- Amplify configured for lazy loading where possible
- Splash screen displayed during initialization
- No blocking operations on main thread during startup
**Current Status:** Not Started
**Notes:** 

---

### 13.4 - Polish UI/UX - Visual Consistency
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** All UI sections  
**Description:** Ensure visual consistency across all screens: colors, fonts, spacing, button styles.  
**Dependencies:** All Phase 1 UI tasks  
**Acceptance Criteria:**
- Brand colors defined and used consistently (brand-blue, accent colors)
- Typography system defined (heading sizes, body text, labels)
- Button styles consistent (primary, secondary, destructive)
- Spacing/padding consistent (use standard increments like 8px, 16px, 24px)
- Rounded corner radii consistent (8px for cards/swatches)
- Icons consistent style (outlined or filled, not mixed)
- Design QA pass on all screens
**Current Status:** Not Started
**Notes:** 

---

### 13.5 - Polish UI/UX - Loading States
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** All UI sections  
**Description:** Ensure all screens have appropriate loading indicators during async operations.  
**Dependencies:** All Phase 1 UI tasks  
**Acceptance Criteria:**
- Loading skeleton/placeholder shown while fetching saved colors (task 9.4)
- Loading spinner shown during color detection (task 5.6)
- Loading spinner shown during save flow (task 8.4)
- Loading spinner shown during sign in/sign up (tasks 3.4, 3.5)
- Loading spinner shown during delete operations (task 9.13)
- No "flash of empty content" (skeleton shown immediately)
**Current Status:** Not Started
**Notes:** 

---

### 13.6 - Polish UI/UX - Empty States
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** All UI sections  
**Description:** Ensure all empty states have helpful illustrations and messaging.  
**Dependencies:** All Phase 1 UI tasks  
**Acceptance Criteria:**
- Saved Colors empty state: illustration + "No saved colors yet. Capture a color to get started!" (task 9.1)
- Search no results: "No colors match your search." (task 9.6)
- Empty states use friendly, encouraging tone
- Empty states include suggested next action (e.g., button to capture color)
**Current Status:** Not Started
**Notes:** 

---

### 13.7 - Accessibility - Screen Reader Support
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Implicit (not specified in PDR but good practice)  
**Description:** Add accessibility labels for screen readers on all interactive elements.  
**Dependencies:** All Phase 1 UI tasks  
**Acceptance Criteria:**
- All buttons have `accessibilityLabel` prop
- All images have `accessibilityLabel` or `accessibilityRole="image"`
- Form inputs have `accessibilityLabel`
- Navigation elements have proper roles
- Test with iOS VoiceOver and Android TalkBack on at least 2 screens

**Testing Notes:** Basic accessibility implementation. Full WCAG compliance is out of scope for MVP per PDR.
**Current Status:** Not Started
**Notes:** 

---

### 13.8 - Documentation - README and Setup Instructions
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 16  
**Description:** Write comprehensive README with setup instructions for dev environment.  
**Dependencies:** All Phase 1 infrastructure tasks  
**Acceptance Criteria:**
- README.md includes:
  - Project overview and tech stack
  - Prerequisites (Node.js version, Expo CLI, AWS CLI, Amplify CLI)
  - Environment setup instructions (clone, npm install, Amplify init)
  - How to run dev build on iOS and Android
  - How to configure environment variables
  - How to deploy to dev/prod via Amplify
- Code comments added to complex logic (color detection, comparison calculations)
- API endpoint documentation (can be auto-generated from OpenAPI spec if created)
**Current Status:** Not Started
**Notes:** 

---

---

# PHASE 2 - ML SEGMENTATION

## 14. ML INFRASTRUCTURE

### 14.1 - Research and Select ML Segmentation Model
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.3.2  
**Description:** Research DeepLabV3+ with MobileNetV3 backbone options and select/acquire pre-trained model for object segmentation.  
**Dependencies:** None  
**Acceptance Criteria:**
- Research publicly available DeepLabV3+ with MobileNetV3 models (TensorFlow Hub, PyTorch Hub, etc.)
- Evaluate model size, accuracy (mIOU), and inference speed on mobile device
- Select model that runs <2 seconds inference on mid-range smartphone
- Model must be compatible with TensorFlow Lite for on-device inference
- Model license allows commercial use
- Decision documented with model source, version, and benchmarks
**Current Status:** Not Started
**Notes:** 

---

### 14.2 - Convert and Quantize Model to TensorFlow Lite
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.3.2  
**Description:** Convert selected segmentation model to TensorFlow Lite format with INT8 quantization.  
**Dependencies:** 14.1  
**Acceptance Criteria:**
- Model converted from original format (TensorFlow SavedModel or PyTorch) to TFLite
- INT8 post-training quantization applied (reduces model size ~75%)
- Quantized model accuracy verified against original (mIOU drop <5%)
- Output file: `segmentation_v1.tflite`
- Model size <20MB (target <10MB if possible)
- Conversion script documented and repeatable

**Testing Notes:** Test quantized model inference on sample images to verify segmentation quality.
**Current Status:** Not Started
**Notes:** 

---

### 14.3 - Upload ML Model to S3
**Assignee:** Cloud - Robert  
**PDR Reference:** Section 4.3.2, Section 9.2  
**Description:** Upload TFLite model to S3 bucket under `models/` prefix.  
**Dependencies:** 2.4, 14.2  
**Acceptance Criteria:**
- Model uploaded to S3 at key: `models/segmentation_v1.tflite` in both dev and prod buckets
- File permissions set to authenticated-read (accessible via pre-signed URLs)
- S3 object metadata includes version tag (e.g., `version=v1`)
**Current Status:** Not Started
**Notes:** 

---

### 14.4 - Create GetMLModelVersion Lambda Function
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.6, Section 10.4  
**Description:** Create Lambda function to return latest ML model version string and S3 key.  
**Dependencies:** 2.4, 2.7, 2.8, 14.3  
**Acceptance Criteria:**
- Lambda function created in both dev and prod
- Endpoint: `GET /ml/model-version`
- No Cognito authorization required (public endpoint)
- Returns `{ latestVersion: "v1", s3Key: "models/segmentation_v1.tflite" }`
- Version string hardcoded in Lambda (can be environment variable for easy updates)
- Logs to CloudWatch
**Current Status:** Not Started
**Notes:** 

---

### 14.5 - Install TensorFlow Lite React Native Library
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.2  
**Description:** Install and configure TensorFlow Lite library for React Native (e.g., `react-native-tflite` or `expo-tflite` if available).  
**Dependencies:** 1.1  
**Acceptance Criteria:**
- TFLite library installed and linked in project
- Library compatible with Expo managed workflow (or migrate to bare workflow if necessary)
- Library tested with a simple model inference on both iOS and Android
- If no Expo-compatible library exists, document decision to eject to bare workflow

**Testing Notes:** Research library options carefully. TFLite support in Expo is limited; may require custom native modules.
**Current Status:** Not Started
**Notes:** 

---

## 15. ML MODEL DOWNLOAD & UPDATE SYSTEM

### 15.1 - Implement Model Version Check on App Launch
**Assignee:** Full Stack Frontend - Alex, API - Sean  
**PDR Reference:** Section 4.3.2  
**Description:** Check for updated ML model on every app launch and download if needed.  
**Dependencies:** 14.4, 14.5  
**Acceptance Criteria:**
- On app launch (before rendering Sign In screen), call `GET /ml/model-version`
- Compare returned `latestVersion` to locally stored version (AsyncStorage)
- If versions match: proceed to Sign In screen
- If versions don't match or no local version: download new model (task 15.2)
- If version check API call fails: use last successfully downloaded model if available, otherwise block app launch with error message
**Current Status:** Not Started
**Notes:** 

---

### 15.2 - Implement Model Download from S3
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.2  
**Description:** Download TFLite model from S3 and save to device filesystem.  
**Dependencies:** 14.3, 15.1  
**Acceptance Criteria:**
- Download model file from S3 using s3Key from task 15.1
- Use Expo FileSystem to save model to permanent local storage (not temporary)
- Show download progress indicator to user ("Downloading AI model... X%")
- On successful download: save version string to AsyncStorage, load model into TFLite interpreter
- On download failure: retry up to 3 times with exponential backoff, then show error and allow user to retry manually
- First-time install: model download is required, block app usage until complete

**Testing Notes:** Test download on slow network. Test first install vs. update scenario.
**Current Status:** Not Started
**Notes:** 

---

### 15.3 - Load TFLite Model into Memory
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.2  
**Description:** Load downloaded TFLite model from filesystem into TFLite interpreter for inference.  
**Dependencies:** 14.5, 15.2  
**Acceptance Criteria:**
- After model download or on app launch (if model already exists locally), load model into TFLite interpreter
- Model loaded once and kept in memory for app session (not reloaded on every inference)
- Model loading time <2 seconds
- Handle model loading errors gracefully (corrupted file, incompatible format)
**Current Status:** Not Started
**Notes:** 

---

## 16. ML SEGMENTATION INTEGRATION

### 16.1 - Update Object Selection Screen for ML Inference
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.3, Section 5.5.2  
**Description:** Update Object Selection screen to run ML inference on tap instead of just placing a marker.  
**Dependencies:** 4.8, 15.3  
**Acceptance Criteria:**
- When user taps on image, show loading indicator
- Run TFLite model inference on captured image to generate segmentation mask
- Inference input: captured image resized to model's expected input size (e.g., 512×512)
- Inference output: segmentation mask (2D array indicating object boundaries)
- Extract mask for object at tapped coordinate (identify segment ID at tap pixel, extract all pixels with same segment ID)
- If inference succeeds: draw segmentation overlay on image (task 16.2)
- If inference fails: fallback to Phase 1 exact point logic (task 16.3)
- Inference completes in <2 seconds per Section 13.2

**Testing Notes:** Test inference speed on target devices (iPhone 11, Pixel 5). Optimize input size if needed.
**Current Status:** Not Started
**Notes:** 

---

### 16.2 - Draw Segmentation Overlay on Image
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.3, Section 5.5.1  
**Description:** Draw semi-transparent white outline over detected object boundary on Object Selection screen.  
**Dependencies:** 16.1  
**Acceptance Criteria:**
- After successful segmentation, draw overlay on captured image
- Overlay: semi-transparent white outline (3px border, slight drop shadow) following object boundary from mask
- Overlay drawn using Canvas or SVG (performant rendering)
- Navigation to Selection Confirmation screen with overlay visible
**Current Status:** Not Started
**Notes:** 

---

### 16.3 - Implement ML Failure Fallback to Exact Point
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 4.3.3 (step 7)  
**Description:** Handle ML inference failures by falling back to Phase 1 exact point selection.  
**Dependencies:** 5.1, 16.1  
**Acceptance Criteria:**
- If TFLite inference throws error or times out: catch error and fallback to exact point logic
- Show brief toast notification: "Auto-boundary unavailable. Would you like to try segmentation again or use exact point selection?"
- Two buttons: "Try Again" and "Use Exact Point"
- "Try Again" returns to Object Selection screen for re-tap
- "Use Exact Point" places Phase 1 marker at original tap coordinate and navigates to Selection Confirmation screen
- User can proceed with color detection using exact point method
**Current Status:** Not Started
**Notes:** 

---

### 16.4 - Update Selection Confirmation Screen for Phase 2
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 5.6.1  
**Description:** Add "Use exact point instead" button to Selection Confirmation screen for Phase 2.  
**Dependencies:** 5.2, 16.2  
**Acceptance Criteria:**
- If Selection Confirmation screen reached via ML segmentation: show tertiary button "Use exact point instead"
- Tapping button: removes segmentation overlay, places Phase 1 marker at original tap coordinate, shows Confirm Selection button
- User can then confirm selection with exact point method instead of segmented area
- If reached via Phase 1 (no ML), button not shown
**Current Status:** Not Started
**Notes:** 

---

### 16.5 - Implement Outlier Removal for Segmented Pixel Averaging
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.3.4, Clarification Answer  
**Description:** Enhance pixel averaging for segmented areas to remove outliers using >2 standard deviations method.  
**Dependencies:** 5.3  
**Acceptance Criteria:**
- Function accepts array of RGB pixel values from segmented area
- Calculate mean RGB and standard deviation for each channel (R, G, B)
- Remove pixels where any channel value is >2 standard deviations from mean
- Recalculate average RGB using remaining pixels
- Return cleaned average RGB
- Function handles edge case where too many pixels removed (e.g., <5 pixels remain → use original average without outlier removal)

**Testing Notes:** Test with image containing noise or highlights (e.g., shiny object with specular reflections).
**Current Status:** Not Started
**Notes:** 

---

### 16.6 - Update DetectColor Lambda for Segmentation Mask
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 10.3.2 Note  
**Description:** Extend DetectColor Lambda to accept optional segmentationMask and average masked pixels.  
**Dependencies:** 5.5, 16.5  
**Acceptance Criteria:**
- Update `POST /colors/detect` request body to accept optional field: `segmentationMask: number[][]` (2D array)
- If segmentationMask provided:
  - Extract all pixels at coordinates where mask == 1
  - Apply outlier removal (task 16.5)
  - Compute average RGB of cleaned pixel set
- If segmentationMask not provided (Phase 1 request):
  - Use existing 5×5 pixel extraction logic
- Rest of pipeline unchanged (RGB → LAB → nearest neighbor matching)
- Backward compatible with Phase 1 requests

**Testing Notes:** Test both Phase 1 and Phase 2 request formats. Verify color accuracy improvement with outlier removal.
**Current Status:** Not Started
**Notes:** 

---

### 16.7 - Update Analytics Event for Phase 2
**Assignee:** Full Stack Frontend - Alex  
**PDR Reference:** Section 14.1.1  
**Description:** Update `color_detected` analytics event to include detection method attribute.  
**Dependencies:** 12.2  
**Acceptance Criteria:**
- `color_detected` event includes attribute: `method: "exact_point"` or `method: "ml_segment"`
- Phase 1 detections log `"exact_point"`
- Phase 2 detections (successful segmentation) log `"ml_segment"`
- Phase 2 detections that fall back to exact point log `"exact_point"` with additional attribute `"ml_fallback": true`
**Current Status:** Not Started
**Notes:** 

---

## 17. PHASE 2 TESTING & OPTIMIZATION

### 17.1 - Comprehensive Testing - Phase 2 ML Features
**Assignee:** Full Stack Frontend - Alex, Full Stack Backend - Adam  
**PDR Reference:** Section 16 Phase 2  
**Description:** Conduct full testing of ML segmentation features on both iOS and Android.  
**Dependencies:** All Phase 2 tasks (14.1 through 16.7)  
**Acceptance Criteria:**
- Test ML segmentation flow: capture → tap object → segmentation succeeds → confirm → detect color
- Test ML failure fallback: force inference error → verify fallback to exact point
- Test "Use exact point instead" button functionality
- Test model download and update: change version in Lambda → verify app downloads new model
- Test with various object types: single-color objects, multi-color objects, small objects, large objects
- Test on physical iOS device (minimum iOS 14)
- Test on physical Android device (minimum Android 10)
- No critical bugs related to ML features

**Testing Notes:** Test with challenging images (low contrast, busy background, reflections).
**Current Status:** Not Started
**Notes:** 

---

### 17.2 - Performance Optimization - ML Inference Speed
**Assignee:** Full Stack Backend - Adam, Full Stack Frontend - Alex  
**PDR Reference:** Section 13.2  
**Description:** Optimize ML inference to meet <2 second target on mid-range devices.  
**Dependencies:** 16.1  
**Acceptance Criteria:**
- ML inference time <2 seconds on mid-range device (iPhone 11, Pixel 5)
- Image preprocessing optimized (resize, normalization)
- Model input size tuned for speed/accuracy tradeoff (e.g., 512×512 vs. 256×256)
- Consider using GPU acceleration if available on device
- Inference time measured and logged for various device types
**Current Status:** Not Started
**Notes:** 

---

### 17.3 - ML Model Accuracy Validation
**Assignee:** Full Stack Backend - Adam  
**PDR Reference:** Section 4.3.2  
**Description:** Validate ML model segmentation accuracy on test image set.  
**Dependencies:** 14.2  
**Acceptance Criteria:**
- Create test set of 50+ images with ground truth segmentation masks
- Run quantized TFLite model inference on test set
- Calculate mIOU (mean Intersection over Union) metric
- mIOU >70% on test set (industry standard for acceptable segmentation)
- Document model performance: accuracy, inference time, failure cases

**Testing Notes:** Use publicly available segmentation datasets (COCO, Pascal VOC) or create custom test set with representative objects.
**Current Status:** Not Started
**Notes:** 

---

### 17.4 - Final Phase 2 Documentation
**Assignee:** Full Stack Backend - Adam, Cloud - Robert  
**PDR Reference:** Section 16  
**Description:** Update documentation to include Phase 2 ML features.  
**Dependencies:** All Phase 2 tasks  
**Acceptance Criteria:**
- README updated with ML model information (source, version, size, accuracy)
- ML model update process documented (how to convert, quantize, upload new version)
- Known limitations documented (object types that segment poorly, lighting conditions, etc.)
- Performance benchmarks documented (inference time on various devices)
**Current Status:** Not Started
**Notes:** 

---

---

# TASK COMPLETION CHECKLIST

## Phase 1 Completion Criteria
- [ ] All tasks 1.1 through 13.8 completed and acceptance criteria met
- [ ] App runs on iOS (minimum iOS 14) and Android (minimum Android 10)
- [ ] Guest mode functional (capture, detect, view themes - no save/compare)
- [ ] Authenticated mode functional (all features including save, rename, delete, compare)
- [ ] Exact point color detection working (<2 second response time)
- [ ] Saved colors persist across sessions for authenticated users
- [ ] Color comparison engine accurate and displays all 4 sliders, score, text summary
- [ ] Color themes generate correctly (complementary, analogous, triadic)
- [ ] All error scenarios handled gracefully with retry options
- [ ] Analytics events tracked and visible in Pinpoint console
- [ ] No critical bugs (P0 or P1 severity)

## Phase 2 Completion Criteria
- [ ] All tasks 14.1 through 17.4 completed and acceptance criteria met
- [ ] ML model downloaded and loaded successfully on app launch
- [ ] ML segmentation functional (tap-to-segment with auto-boundary)
- [ ] Segmentation overlay displays correctly
- [ ] Fallback to exact point works when ML fails
- [ ] "Use exact point instead" option functional
- [ ] Outlier removal improves color accuracy for segmented areas
- [ ] ML inference time <2 seconds on mid-range devices
- [ ] Model update mechanism functional (new version downloaded when available)
- [ ] No critical ML-related bugs

---

# APPENDIX: TASK DEPENDENCIES VISUALIZATION

**Note:** Dependencies are listed in each task. Critical path:
1. Project Setup (1.1 → 1.5)
2. AWS Infrastructure (2.1 → 2.8)
3. Authentication (3.1 → 3.17) - blocks all authenticated features
4. Image Capture (4.1 → 4.8)
5. Color Detection Phase 1 (5.1 → 5.6)
6. Color Naming (6.1 → 6.5)
7. UI Screens and Features (parallel work on 7.x, 8.x, 9.x, 10.x)
8. Phase 1 Testing (13.1 → 13.8) - blocks Phase 2 start
9. ML Infrastructure (14.1 → 14.5) - can start during Phase 1 if resources available
10. Phase 2 Integration (16.1 → 16.7)
11. Phase 2 Testing (17.1 → 17.4)

---

**END OF TASKS.MD**
