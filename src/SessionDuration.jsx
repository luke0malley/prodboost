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
                    <Form className="row justify-content-between" onSubmit={(e) => e.preventDefault()}>
                        <Form.Group controlId="formSessionDuration" className="col-6 row">
                            <Form.Label className="mb-2">
                                For how long do you want to block URLs?
                            </Form.Label>
                            <Form.Control type="number" min="0" value={durationAmt} className="w-25 ms-3"
                                onChange={(e) => setDurationAmt(e.target.value)}
                            />
                            <Dropdown className="w-50">
                                <Dropdown.Toggle variant="secondary">
                                    {durationUnit}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        DURATION_UNIT_OPTIONS.map(unit =>
                                            <Dropdown.Item onClick={() => setDurationUnit(unit)}>
                                                {unit}
                                            </Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Button variant="success" type="button" className="col-4 h-content align-self-end"
                            onClick={() => console.log("start blocking button clicked")}
                        >
                            Start blocking
                        </Button>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}