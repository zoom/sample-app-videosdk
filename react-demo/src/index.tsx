/* eslint-disable no-restricted-globals */
import React from 'react';
import ReactDOM from 'react-dom';
import ZoomVideo from '@zoom/videosdk';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ZoomContext from './context/zoom-context';
import { devConfig } from './config/dev';
import { b64DecodeUnicode, generateVideoToken } from './utils/util';

let meetingArgs: any = Object.fromEntries(new URLSearchParams(location.search));
// Add enforceGalleryView to turn on the gallery view without SharedAddayBuffer
if (
  !meetingArgs.sdkKey ||
  !meetingArgs.topic ||
  !meetingArgs.name ||
  !meetingArgs.signature
) {
  meetingArgs = {...meetingArgs,...devConfig};
  meetingArgs.enforceGalleryView = true;
}

if (meetingArgs.web) {
  if (meetingArgs.topic) {
    try {
      meetingArgs.topic = b64DecodeUnicode(meetingArgs.topic);
    } catch (e) {}
  } else {
    meetingArgs.topic = '';
  }

  if (meetingArgs.name) {
    try {
      meetingArgs.name = b64DecodeUnicode(meetingArgs.name);
    } catch (e) {}
  } else {
    meetingArgs.name = '';
  }

  if (meetingArgs.password) {
    try {
      meetingArgs.password = b64DecodeUnicode(meetingArgs.password);
    } catch (e) {}
  } else {
    meetingArgs.password = '';
  }

  if (meetingArgs.sessionKey) {
    try {
      meetingArgs.sessionKey = b64DecodeUnicode(meetingArgs.sessionKey);
    } catch (e) {}
  } else {
    meetingArgs.sessionKey = '';
  }

  if (meetingArgs.userIdentity) {
    try {
      meetingArgs.userIdentity = b64DecodeUnicode(meetingArgs.userIdentity);
    } catch (e) {}
  } else {
    meetingArgs.userIdentity = '';
  }

  if (meetingArgs.role) {
    meetingArgs.role = parseInt(meetingArgs.role, 10);
  } else {
    meetingArgs.role = 1;
  }
}
if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
  meetingArgs.signature = generateVideoToken(
    meetingArgs.sdkKey,
    meetingArgs.sdkSecret,
    meetingArgs.topic,
    meetingArgs.password,
    meetingArgs.userIdentity,
    meetingArgs.sessionKey,
    parseInt(meetingArgs.role, 10)
  );
}
console.log('=====================================');
console.log('meetingArgs', meetingArgs);
const zmClient = ZoomVideo.createClient();
ReactDOM.render(
  <React.StrictMode>
    <ZoomContext.Provider value={zmClient}>
      <App meetingArgs={meetingArgs as any} />
    </ZoomContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
