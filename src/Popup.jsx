import React from 'react';
import SessionDuration from './SessionDuration';
import BlockedURLs from './BlockedURLs';
import NotificationSettings from './NotificationSettings';
import './OverrideBootstrap.css';

export default function Popup() {

    return (<>
        <SessionDuration />
        <BlockedURLs />
        <NotificationSettings />
    </>);
}