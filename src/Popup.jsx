import React from 'react';
import SessionDuration from './SessionDuration';
import BlockedURLs from './BlockedURLs';
import NotificationSettings from './NotificationSettings';
import './OverrideBootstrap.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Popup() {

    return (
    <Tabs
        defaultActiveKey="block-urls"
        id="popup-tabs"
        className="mb-5"
    >
        <Tab eventKey="block-urls" title="Block URLs">
            <SessionDuration />
            <BlockedURLs />
            <NotificationSettings />
        </Tab>
        <Tab eventKey="dashboard" title="Dashboard">
            <p>This is where the dashboard goes</p>
        </Tab>
    </Tabs>
    );
}