"use client"
import AppSpinner from "@/components/AppSpinner";
import AppToast from "@/components/AppToast";
import { AutomatedNotification, EmailInterface } from "@/types";
import getFrequencyInFrench from "@/utils/getFrequencyInFrench";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { Check, Email, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import { collection, query, where, getDocs, updateDoc, arrayRemove, doc as firestoreDoc } from 'firebase/firestore';
import { useState } from "react";
import { db } from "@/firebase/firebase";
import { useUser } from "@/context/authContext";

const AutomatedNotificationTabForEmail = ({ notification, order, userId }: { notification: AutomatedNotification, order: number, userId: string }) => {
  const [expand, setExpand] = useState(false);
  const { user, updateUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenY, onOpen: onOpenY, onClose: onCloseY } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [activeStatusText, setActiveStatusText] = useState('');
  const toast = useToast();

  async function deleteAutomatedNotification(userId: string, notificationId: string) {
    try {
      setLoading(true);

      const collectionRef = collection(db, 'users');
      const q = query(collectionRef, where('id', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const docRef = firestoreDoc(collection(db, 'users'), doc.id);
          const docData = doc.data();
          const fieldArray = docData['automatedNotifications'] || [];
          const notificationToRemove = fieldArray.find((notif: AutomatedNotification) => notif.id === notificationId);

          if (notificationToRemove) {
            await updateDoc(docRef, {
              'automatedNotifications': arrayRemove(notificationToRemove)
            });
            await updateUser();
            console.log('Notification successfully removed from the document field!');
          } else {
            console.log('No matching notification found in the field.');
          }
        });
      } else {
        console.log('No matching documents found.');
      }
    } catch (error) {
      console.error('Error updating document field:', error);
    } finally {
      setLoading(false);
      onClose();
      toast({
        position: 'bottom-left',
        render: () => (
          <AppToast variant="SUCCESS" title="Notification deleted" Icon={Check} />
        ),
      });
    }
  }

  async function toggleAutomatedNotification(userId: string, notificationId: string, activate: boolean) {
    try {
      setLoading(true);

      const collectionRef = collection(db, 'users');
      const q = query(collectionRef, where('id', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const docRef = firestoreDoc(collection(db, 'users'), doc.id);
          const docData = doc.data();
          const fieldArray = docData['automatedNotifications'] || [];
          const notificationIndex = fieldArray.findIndex((notif: AutomatedNotification) => notif.id === notificationId);

          if (notificationIndex !== -1) {
            fieldArray[notificationIndex].activated = activate;
            await updateDoc(docRef, {
              'automatedNotifications': fieldArray
            });
            await updateUser();
            console.log(`Notification successfully ${activate ? 'activated' : 'deactivated'}!`);
          } else {
            console.log('No matching notification found in the field.');
          }
        });
      } else {
        console.log('No matching documents found.');
      }
    } catch (error) {
      console.error('Error updating document field:', error);
    } finally {
      setLoading(false);
      onCloseY();
      toast({
        position: 'bottom-left',
        render: () => (
          <AppToast variant="SUCCESS" title={`Notification ${activate ? 'activated' : 'deactivated'}`} Icon={Check} />
        ),
      });
    }
  }

  return (
    <>
      <Modal open={isOpen} onClose={onClose} disableAutoFocus>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          className="bg-white rounded-md p-6 flex gap-7 flex-col">
          <p className="text-xl">Do you really want to delete this notification?</p>
          <div className="flex gap-3">
            <button className="border-2 border-primary-color font-bold text-black rounded-full p-3 flex gap-2 items-center" onClick={onClose}>Cancel</button>
            <button onClick={async () => await deleteAutomatedNotification(userId, notification.id)} className="bg-primary-color font-bold text-white rounded-full p-3 flex gap-2 items-center">{loading && <AppSpinner variant="LIGHT" size={26} />}Delete</button>
          </div>
        </div>
      </Modal>
      <Modal open={isOpenY} onClose={onCloseY} disableAutoFocus>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          className="bg-white rounded-md p-6 flex gap-7 flex-col">
          <p className="text-xl">{activeStatusText}</p>
          <div className="flex gap-3">
            <button className="border-2 border-primary-color font-bold text-black rounded-full p-3 flex gap-2 items-center" onClick={onCloseY}>Cancel</button>
            <button onClick={async () => await toggleAutomatedNotification(userId, notification.id, !notification.activated)} className="bg-primary-color font-bold text-white rounded-full p-3 flex gap-2 items-center">{loading && <AppSpinner variant="LIGHT" size={26} />}{notification.activated ? 'Deactivate' : 'Activate'}</button>
          </div>
        </div>
      </Modal>
      <div className={`rounded-lg border-2 bg-white shadow-md p-3 px-5 flex flex-col gap-4 transition-height ${expand ? "h-auto" : "h-[64px]"} overflow-hidden`}>
        <div className="flex justify-between items-center w-full font-bold">
          <div className="flex gap-3">
            <Email />
            <div>Email-{order}</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              Status: {notification.activated ?
                <div className="flex items-center">
                  <div className="rounded-full bg-green-400 w-4 aspect-square"></div>
                  <div className="font-normal text-slate-600 pl-3">Active</div>
                </div> :
                <div className="flex items-center">
                  <div className="rounded-full bg-red-500 w-4 aspect-square"></div>
                  <div className="font-normal text-slate-600 pl-3">Inactive</div>
                </div>}
            </div>
            <IconButton onClick={() => setExpand(prev => !prev)}>
              {expand ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </div>
        </div>
        <div className="border-t border-slate-600 py-5">
          <div className="text-slate-600 flex gap-4 font-semibold">
            <div className="border-r border-slate-500 pr-4">Next send: {notification.scheduledDate}</div>
            <div>Frequency: every {getFrequencyInFrench(notification.every)}</div>
          </div>
          <div className="mt-4">
            <div>Subject:<br />
              <div className="font-bold">{(notification.content as EmailInterface).subject}</div>
            </div>
          </div>
          <div>
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: (notification.content as EmailInterface).email }} />
            <div className="font-bold mt-2">{(notification.content as EmailInterface).sender}</div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => {
              setActiveStatusText(`Do you really want to ${notification.activated ? 'deactivate' : 'activate'} this notification?`);
              onOpenY();
            }} className="bg-primary-color rounded-full p-3 text-white font-bold">{notification.activated ? 'Deactivate' : 'Activate'}</button>
            <button onClick={onOpen} className="bg-red-600 rounded-full p-3 text-white font-bold">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

function AutomatedNotificationsSection() {
  const { user, updateUser, loading } = useUser();

  return (
    <div>
      {!user?.automatedNotifications.length?<div className="text-center">No notifications found</div>:
      <>
      <h2 className="pb-4 font-bold text-xl">Automated Emails</h2>
      <div className="flex flex-col gap-3">
        {user?.automatedNotifications.filter(o => o.type == "Email").map((o, i) => <AutomatedNotificationTabForEmail key={i} userId={user.id} notification={o} order={i + 1} />)}
      </div></>}
    </div>
  );
}

export default AutomatedNotificationsSection;
