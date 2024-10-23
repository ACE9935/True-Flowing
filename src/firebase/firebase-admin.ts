import { initializeApp, getApps, cert } from 'firebase-admin/app';
var admin = require("firebase-admin");

const firebaseAdminConfig = {
    credential: cert(JSON.parse(process.env.SDK!))
}

export function customInitApp() {

    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}