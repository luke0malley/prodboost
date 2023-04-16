/*global chrome*/
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

export default function NotificationSettings() {

    const [notificationSettings, setNotificationSettings] = useState({});

    useEffect(() => {
        chrome.storage?.sync.get(["notificationsettings"]).then((result) => {
            if (result.notificationsettings) {
                setNotificationSettings(result.notificationsettings)
            }
            else {
                setNotificationSettings({
                    'idle': {
                        description: 'I have been idle for too long', isOn: true
                    }
                });
            }
        })
    }, []);

    useEffect(() => {
        chrome.storage?.sync.set({ "notificationsettings": notificationSettings })
    }, [notificationSettings])

    const handleNotificationSwitchChange = (settingName) => {
        setNotificationSettings({
            ...notificationSettings,
            [settingName]: {
                ...notificationSettings[settingName],
                isOn: !notificationSettings[settingName].isOn
            }
        });
    }

    return (
        <Accordion flush
            id="section-session-duration" className="mb-5"
        >
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <span className="text-lg">Notification Settings</span>
                </Accordion.Header>
                <Accordion.Body>
                    <Table hover>
                        <thead>
                            <tr>
                                <th scope="col">Notify me when:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(notificationSettings).map(settingName =>
                                <tr key={`row-${settingName}`}>
                                    <td>
                                        <Form>
                                            <Form.Check
                                                type="switch"
                                                id={`switch-${settingName}`}
                                                label={notificationSettings[settingName].description}
                                                className="my-1"
                                                onChange={() => handleNotificationSwitchChange(settingName)}
                                                checked={notificationSettings[settingName].isOn}
                                            />
                                        </Form>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}