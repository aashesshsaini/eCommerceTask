// import admin from "firebase-admin"
// import path from "path"
// // Load the service account key JSON file
// const serviceAccountPath = path.join(__dirname, '../../ozmarineFirebase.json');
// const serviceAccount = require(serviceAccountPath);

// // Initialize the Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// function sendPushNotification(title:string, message:string, deviceTokens:string[]) {
//   return new Promise((resolve, reject) => {
//     try {
//       const messages = {
//         tokens: deviceTokens, // Use tokens for multiple device tokens
//         notification: {
//           title: title,
//           body: message,
//         },
//         data: {
//           title: title,
//           body: message,
//         },
//         android: {
//           notification: {
//             click_action: 'AcceptOrReject',
//             sound: 'default',
//             priority: 'high' as 'high'
//           }
//         },
//         apns: {
//           payload: {
//             aps: {
//               sound: 'default',
//               category: 'AcceptOrReject'
//             },
//           },
//           headers: {
//             'apns-priority': '10'
//           }
//         },
//         // Set the time to live (TTL)
//         webpush: {
//           headers: {
//             TTL: '2000',
//           },
//           notification: {
//             requireInteraction: true
//           }
//         },
//       };

//       admin.messaging().sendMulticast(messages)
//         .then((response) => {
//           console.log('Successfully sent push notification:', response);
//           if (response.failureCount > 0) {
//             console.log('Failures:', response.responses.filter(r => !r.success).map(r => r.error));
//           }
//           resolve(response);
//         })
//         .catch((error) => {
//           console.error('Error sending push notification:', error);
//           reject(error);
//         });
//     } catch (error) {
//       console.error('An error occurred:', error);
//       reject(error);
//     }
//   });
// }

// export default sendPushNotification
