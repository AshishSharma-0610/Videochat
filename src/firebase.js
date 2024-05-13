// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlJCjPVzh0Rme0R79HhKcyfj3lAyLvNuQ",
    authDomain: "videochat-app-8890a.firebaseapp.com",
    projectId: "videochat-app-8890a",
    storageBucket: "videochat-app-8890a.appspot.com",
    messagingSenderId: "1048228539133",
    appId: "1:1048228539133:web:f6e304cad1300e056cec94"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

// Function to send an offer to the callee
async function sendOffer(calleeId, offerSDP) {
    try {
        const offerRef = firebase.database().ref('signaling/offers').push();
        await offerRef.set({
            sender: firebase.auth().currentUser.uid,
            receiver: calleeId,
            offer: offerSDP
        });
    } catch (error) {
        console.error('Error sending offer: ', error);
    }
}

// Listen for incoming offers
firebase.database().ref('signaling/offers').on('child_added', async (snapshot) => {
    try {
        const offerData = snapshot.val();
        const { sender, offer } = offerData;

        // Check if the offer is for the current user
        if (firebase.auth().currentUser.uid === offerData.receiver) {
            // Process the offer and initiate the call
            // Create peer connection, set remote description, etc.
        }
    } catch (error) {
        console.error('Error receiving offer: ', error);
    }
});

// Function to send an answer to the caller
async function sendAnswer(callId, answerSDP) {
    try {
        const answerRef = firebase.database().ref(`signaling/answers/${callId}`);
        await answerRef.set({
            answer: answerSDP
        });
    } catch (error) {
        console.error('Error sending answer: ', error);
    }
}

// Listen for incoming answers
firebase.database().ref('signaling/answers').on('child_added', async (snapshot) => {
    try {
        const answerData = snapshot.val();
        const { answer } = answerData;

        // Process the answer and set remote description
        // Set remote description on the corresponding peer connection
    } catch (error) {
        console.error('Error receiving answer: ', error);
    }
});

// Function to send ICE candidates
async function sendICECandidate(callId, candidate) {
    try {
        const candidatesRef = firebase.database().ref(`signaling/candidates/${callId}`);
        await candidatesRef.push(candidate);
    } catch (error) {
        console.error('Error sending ICE candidate: ', error);
    }
}

// Listen for incoming ICE candidates
firebase.database().ref('signaling/candidates').on('child_added', async (snapshot) => {
    try {
        const callId = snapshot.key;
        const candidatesData = snapshot.val();

        // Process ICE candidates and add them to the corresponding peer connection
        Object.values(candidatesData).forEach(candidate => {
            // Add ICE candidate to the corresponding peer connection
        });
    } catch (error) {
        console.error('Error receiving ICE candidate: ', error);
    }
});
