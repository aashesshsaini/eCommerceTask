"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const serviceAccountPath = path_1.default.join(__dirname, "../../appKey.json");
console.log(serviceAccountPath, "serviceAccountPath");
const serviceAccount = require(serviceAccountPath);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
function sendPushNotification(title, deviceTokens, body, jamId, userName) {
    return new Promise((resolve, reject) => {
        try {
            const message = {
                tokens: deviceTokens,
                data: {
                    user: JSON.stringify(Object.assign(Object.assign({}, (jamId && { jamId: String(jamId) })), { userName })),
                    title: String(title),
                    body: String(body),
                },
                notification: {
                    title: title,
                    body: body,
                },
                apns: {
                    payload: {
                        aps: {
                            alert: {
                                title: String(title),
                                body: String(body),
                            },
                            badge: 1,
                            sound: "default",
                            // category: "AcceptOrReject",
                        },
                    },
                    headers: {
                        "apns-priority": "10",
                    },
                },
                webpush: {
                    headers: {
                        TTL: "2000",
                    },
                    notification: {
                        requireInteraction: true,
                    },
                },
            };
            firebase_admin_1.default
                .messaging()
                .sendEachForMulticast(message) // Using sendMulticast to send to multiple device tokens
                .then((response) => {
                // console.log("Successfully sent push notification:", response);
                if (response.failureCount > 0) {
                    // console.log(
                    //   "Failures:",
                    //   response.responses
                    //     .filter((r: Dictionary) => !r.success)
                    //     .map((r: Dictionary) => r.error)
                    // );
                }
                resolve(response);
            })
                .catch((error) => {
                // console.error("Error sending push notification:", error);
                reject(error);
            });
        }
        catch (error) {
            // console.error("An error occurred:", error);
            reject(error);
        }
    });
}
exports.default = sendPushNotification;
