import React, { useState } from 'react';
import List from './List';
import Accordion from 'react-bootstrap/Accordion';

export default function BlockedURLs() {
    const DURATION_UNIT_OPTIONS = ['minute(s)', 'hour(s)', 'day(s)']
    const [durationAmt, setDurationAmt] = useState(30);
    const [notificationSettings, setNotificationSettings] = useState([
        { name: 'session-finish', description: 'blocked session is finished', isOn: false },
        { name: 'idle', description: 'I have been idle for too long', isOn: false }
    ]);

    return (
        <Accordion defaultActiveKey="0" flush
            id="section-session-duration" className="mb-5"
        >
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <span className="text-lg">Blocked URLs</span>
            </Accordion.Header>
            <Accordion.Body>
                <List />
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
);
}