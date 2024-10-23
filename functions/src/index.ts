const {onSchedule} = require("firebase-functions/v2/scheduler");
const {logger} = require("firebase-functions");

import { sendClientEmail } from './sendClientEmail';
import * as admin from 'firebase-admin';
import { AutomatedNotification, AutomateType, EmailInterface } from './types';

admin.initializeApp();

const db = admin.firestore();

if (process.env.FUNCTIONS_EMULATOR) {
  const firestore = admin.firestore();
  firestore.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

exports.resetScansPerDay = onSchedule('every day 00:00',async () => {
  try {
    const snapshot = await db.collection('users').get();
  
    const today = new Date();
    const today2=new Date()
    today.setDate(today.getDate() - 1);
    const yesterday = today.toISOString().split('T')[0]; // Get yesterday's date in 'YYYY-MM-DD' format

    const promises: Promise<void>[] = [];

    // Process each user document
    snapshot.forEach(async (doc) => {
      const data = doc.data();

      // Reset scansPerDay and update scansForDate for qrCodes
      const qrCodes = data.qrCodes.map((code: any) => {
        const scansForDate = code.scansForDate || [];
        scansForDate.push({ date: yesterday, scans: code.scansPerDay || 0 });

        const winnersForDate = code.winnersForDate || [];
        winnersForDate.push({ date: yesterday, winners: code.winnersPerDay || 0 });

        return {
          ...code,
          winnersPerDay:0,
          scansPerDay: 0,
          scansForDate,
          winnersForDate
        };
      })

      // Update qrCodes in the document
      promises.push(doc.ref.update({ qrCodes }).then(() => undefined)); // Ensure promise resolves with 'undefined'

      // Process automatedNotifications
      data.automatedNotifications.forEach(async (notification: AutomatedNotification) => {

        if (notification.scheduledDate === today2.toISOString().split('T')[0]) {

          if (notification.type === "Email" && notification.activated) {

            const emailContent = (notification.content as EmailInterface).email;
            const subject = (notification.content as EmailInterface).subject;
            const sender = (notification.content as EmailInterface).sender;
            const emails = data.clientEmails as {content:string}[];
            await sendClientEmail({ emailContent, sender, subject, identifier: emails,userName:data.name })// Ensure promise resolves with 'undefined'
          } 

          // Calculate next scheduledDate based on 'every' value
          const { every } = notification;
          const newScheduledDate = calculateNextScheduledDate(today, every);

          // Update scheduledDate in the database
          promises.push(doc.ref.update({
            automatedNotifications: admin.firestore.FieldValue.arrayRemove(notification),
          }).then(() => undefined)); // Ensure promise resolves with 'undefined'
          promises.push(doc.ref.update({
            automatedNotifications: admin.firestore.FieldValue.arrayUnion({
              ...notification,
              scheduledDate: newScheduledDate,
            }),
          }).then(() => undefined)); // Ensure promise resolves with 'undefined'
        }
      });
    });

    await Promise.all(promises);
    console.log('ScansPerDay and winnersPerDay reset and automated notifications processed successfully');
  } catch (error) {
    console.error('Error resetting scansPerDay and winnersPerDay and processing automated notifications:', error);
  }

  logger.log('scansPerDay and winnersPerDay successfully reset to 0 for all documents');
});

// Function to reset scansPerWeek to 0 for all documents
exports.resetScansPerWeek = onSchedule('every sunday 00:00', async () => {
  const snapshot = await db.collection('users').get();
  snapshot.forEach(async (doc) => {
    const qrCodes = doc.data().qrCodes.map((code: any) => ({ ...code, scansPerWeek: 0,winnersPerWeek:0 }));
    await doc.ref.update({ qrCodes });
  });
  logger.log('scansPerWeek and winnersPerWeek successfully reset to 0 for all documents');
});

// Function to reset scansPerMonth to 0 for all documents
exports.resetScansPerMonth = onSchedule('first day of month 00:00', async () => {

  const snapshot = await db.collection('users').get();
  snapshot.forEach(async (doc) => {
    const qrCodes = doc.data().qrCodes.map((code: any) => ({ ...code, scansPerMonth: 0,winnersPerMonth:0 }));
    await doc.ref.update({ qrCodes });
  });
  logger.log('scansPerMonth and winnersPerMonth successfully reset to 0 for all documents');
  
});

function calculateNextScheduledDate(currentDate: Date, every: AutomateType): string {
  const date = new Date(currentDate);

  switch (every) {
    case "3-day":
      date.setDate(date.getDate() + 3);
      break;
    case "1-week":
      date.setDate(date.getDate() + 7);
      break;
    case "1-month":
      date.setMonth(date.getMonth() + 1);
      break;
    case "3-month":
      date.setMonth(date.getMonth() + 3);
      break;
    default:
      throw new Error("Invalid AutomateType");
  }

  return date.toISOString().split('T')[0]; // Return date in 'YYYY-MM-DD' format
}