import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

export default function NotificationSettings() {
    const [notificationSettings, setNotificationSettings] = useState({
        'session-finish': {
            description: 'blocked session is finished', isOn: false
        },
        'idle': {
            description: 'I have been idle for too long', isOn: false
        }
    });

    return (
        <Accordion defaultActiveKey="0" flush
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
                                            {/* TODO: save/connect switch with notificationSettings object */}
                                            <Form.Check
                                                type="switch"
                                                id={`switch-${settingName}`}
                                                label={notificationSettings[settingName].description}
                                                className="my-1"
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