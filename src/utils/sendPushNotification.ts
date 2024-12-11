import { ObjectId } from "mongoose";
import admin from "firebase-admin";
import path from "path";
import { Dictionary } from "../types";

const serviceAccountPath = path.join(__dirname, "../../appKey.json");
console.log(serviceAccountPath, "serviceAccountPath");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendPushNotification(
  title: string,
  deviceTokens: string[],
  body: string,
  jamId?: string,
  userName?: string
) {
  return new Promise((resolve, reject) => {
    try {

      const message: any = {
        tokens: deviceTokens, 
        data: {
          user: JSON.stringify({
            ...(jamId && { jamId: String(jamId) }),
            userName,
          }),
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

      admin
        .messaging()
        .sendEachForMulticast(message) // Using sendMulticast to send to multiple device tokens
        .then((response: Dictionary) => {
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
        .catch((error: Error) => {
          // console.error("Error sending push notification:", error);
          reject(error);
        });
    } catch (error) {
      // console.error("An error occurred:", error);
      reject(error);
    }
  });
}

export default sendPushNotification;
