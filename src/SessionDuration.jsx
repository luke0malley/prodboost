import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

export default function SessionDuration() {
    const DURATION_UNIT_OPTIONS = ['minute(s)', 'hour(s)', 'day(s)']
    const [durationAmt, setDurationAmt] = useState(30);
    const [durationUnit, setDurationUnit] = useState(DURATION_UNIT_OPTIONS[0]);

    return (
        <Accordion defaultActiveKey="0" flush
            id="section-session-duration" className="mb-5"
        >
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <span className="text-lg">Blocked Session Duration</span>
            </Accordion.Header>
            <Accordion.Body>
                <Form className="row justify-content-between">
                    <Form.Group controlId="formSessionDuration" className="col-6 row">
                        <Form.Label>For how long do you want to block URLs?</Form.Label>
                        <Form.Control type="number" min="0" placeholder="30" className="w-25 ms-3" />
                        <Dropdown className="w-50">
                            <Dropdown.Toggle variant="secondary">
                                {durationUnit}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            {
                                DURATION_UNIT_OPTIONS.map(unit =>
                                <Dropdown.Item>
                                    {unit}
                                </Dropdown.Item>)
                            }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Button variant="success" type="button" className="col-4 h-content align-self-end" onClick={() => console.log("submit session duration")}>
                        Start blocking
                    </Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
);
}