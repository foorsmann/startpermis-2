# Admin Setup - Firebase Custom Claims

## Overview

Start Permis uses Firebase Custom Claims for admin authentication. This is more secure than hardcoding email addresses in security rules.

## Setting Admin Claims

### Option 1: Using Firebase Admin SDK (Node.js)

Create a script to set admin claims:

```javascript
// scripts/set-admin-claims.js
const admin = require('firebase-admin');

// Initialize with your service account
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json')
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set admin claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`Successfully set admin claim for ${email} (UID: ${user.uid})`);

    // User needs to sign out and sign back in for claims to take effect
    console.log('User should sign out and sign back in to get new claims.');
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
}

// Replace with admin email
setAdminClaim('webarcdesign.ro@gmail.com');
```

Run with:
```bash
node scripts/set-admin-claims.js
```

### Option 2: Using Firebase Console (Cloud Functions)

Deploy a Cloud Function to set claims:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow existing admins to set new admins
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }

  const { email } = data;
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });

  return { success: true, message: `Admin claim set for ${email}` };
});
```

### Option 3: One-time setup via Firebase Console

1. Go to Firebase Console > Authentication > Users
2. Find the user by email
3. Note their UID
4. Go to Firebase Console > Functions (or use Admin SDK)
5. Run a function to set the claim

## Verifying Admin Claims

After setting claims, verify they work:

```javascript
// In browser console after signing in
firebase.auth().currentUser.getIdTokenResult(true).then(result => {
  console.log('Admin claim:', result.claims.admin);
});
```

## Migration from Email-based to Claims-based

1. **Current state**: Security rules check both Custom Claims AND email fallback
2. **Step 1**: Set Custom Claims for all admin users
3. **Step 2**: Verify claims work correctly
4. **Step 3**: Remove email fallback from rules (optional, but recommended)

### Removing Email Fallback

After confirming Custom Claims work, update rules:

**firestore.rules & storage.rules:**
```
function isAdmin() {
  return isEmailVerified()
    && request.auth.token.admin == true;
}
```

## Security Notes

- Custom Claims are stored in the user's ID token
- Maximum 1000 bytes for all claims combined
- Claims are cached and refresh on token refresh (usually 1 hour)
- User must sign out and sign back in to get new claims immediately

## Troubleshooting

### Claims not working?
1. User needs to sign out and sign back in
2. Check token expiration (force token refresh)
3. Verify claim was set: `admin.auth().getUser(uid).then(user => console.log(user.customClaims))`

### Token too large?
Keep claims minimal. Use only boolean flags like `{ admin: true }`.
