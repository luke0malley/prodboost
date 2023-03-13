/*global chrome*/
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

export default function SessionDuration() {
    const DURATION_UNIT_OPTIONS = ['minute(s)', 'hour(s)', 'day(s)']
    const [durationAmt, setDurationAmt] = useState(0);
    const [durationUnit, setDurationUnit] = useState(DURATION_UNIT_OPTIONS[0]);
    const [blockingSession, setBlockingSession] = useState({ blocking: false });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(["blockingsession"]).then((result) => {
            if (result.blockingsession) {
                setBlockingSession(result.blockingsession);
            }
            else {
                chrome.storage.sync.set({ "blockingsession": { blocking: false } })
                setBlockingSession({ blocking: false });
            }
        })
        setLoaded(true);
        setInterval(updateBlockingTime, 5000);
    }, []);

    const handleBlockingClick = () => {
        if (blockingSession.blocking) {
            chrome.storage.sync.set({ "blockingsession": { blocking: false } })
            setBlockingSession({ blocking: false });
        }
        else {
            if (durationAmt === 0) {
                return;
            }
            chrome.storage.sync.set({ "blockingsession": { blocking: true, blocking_time: moment().add(durationAmt, durationUnit[0]).toISOString() } })
            setBlockingSession({ blocking: true, blocking_time: moment().add(durationAmt, durationUnit[0]).toISOString() })
        }
    }

    const updateBlockingTime = () => {
        chrome.storage.sync.get(["blockingsession"]).then((result) => {
            if (moment() >= moment(result.blockingsession.blocking_time)) {
                setBlockingSession({ blocking: false });
                chrome.storage.sync.set({ "blockingsession": { blocking: false } });
            }
            else {
                chrome.storage.sync.set({ "blockingsession": result.blockingsession })
                setBlockingSession(result.blockingsession);
            }
        })
    }

    if (loaded) {
        console.log(blockingSession)
        return (
            <>
                {
                    blockingSession.blocking &&
                    <Alert variant="success">
                        Blocking URLs for {moment(blockingSession.blocking_time).fromNow(true)}
                    </Alert>
                }
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
                                <Button variant={blockingSession.blocking ? "danger" : "success"} type="button" className="col-4 h-content align-self-end"
                                    onClick={handleBlockingClick}
                                >
                                    {blockingSession.blocking ? "Stop blocking" : "Start blocking"}
                                </Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </>
        );
    }
}