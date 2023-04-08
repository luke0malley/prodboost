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
        chrome.storage?.sync.get(["blockingsession"]).then((result) => {
            if (result.blockingsession) {
                setBlockingSession(result.blockingsession);
                setInterval(updateBlockingTime, 1000);
            }
            else {
                chrome.storage?.sync.set({ "blockingsession": { blocking: false } })
                setBlockingSession({ blocking: false });
            }
        })
        setLoaded(true);
    }, []);

    const handleBlockingClick = () => {
        if (blockingSession.blocking) {
            chrome.storage?.sync.set({ "blockingsession": { blocking: false } })
            setBlockingSession({ blocking: false });
        }
        else {
            if (durationAmt === 0) {
                return;
            }
            setInterval(updateBlockingTime, 1000);
            chrome.storage?.sync.set({ "blockingsession": { blocking: true, blocking_time: moment().add(durationAmt, durationUnit[0]).toISOString() } })
            setBlockingSession({ blocking: true, blocking_time: moment().add(durationAmt, durationUnit[0]).toISOString() })
        }
    }

    const updateBlockingTime = () => {
        chrome.storage?.sync.get(["blockingsession"]).then((result) => {
            if (moment() >= moment(result.blockingsession.blocking_time)) {
                setBlockingSession({ blocking: false });
                chrome.storage?.sync.set({ "blockingsession": { blocking: false } });
            }
            else {
                chrome.storage?.sync.set({ "blockingsession": result.blockingsession })
                setBlockingSession(result.blockingsession);
            }
        })
    }

    const getBlockingTime = () => {
        let days = moment(blockingSession.blocking_time).diff(moment(), 'd')
        let hours = moment(blockingSession.blocking_time).diff(moment(), 'h')
        let minutes = moment(blockingSession.blocking_time).diff(moment(), 'm')
        let seconds = moment(blockingSession.blocking_time).diff(moment(), 's')
        let output = ""
        if (days > 0) {
            output += days + " days, "
        }
        if (hours > 0) {
            output += (hours % 24) + " hours, "
        }
        if (minutes > 0) {
            output += (minutes % 60) + " minutes, "
        }
        if (seconds > 0) {
            output += (seconds % 60) + " seconds"
        }
        return output
    }

    if (loaded) {
        return (
            <>
                {
                    blockingSession.blocking &&
                    <Alert variant='light'>
                        <p className="text-success text-center">
                            Blocking URLs for {getBlockingTime()}
                        </p>
                    </Alert>
                }
                <Accordion flush
                    id="section-session-duration" className="mb-5"
                >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <span className="text-lg">Blocked Session Duration</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Form className="row justify-content-between" onSubmit={(e) => e.preventDefault()}>
                                <Form.Label className="mb-2" htmlFor="formSessionDuration">
                                    For how long do you want to block URLs?
                                </Form.Label>
                                <Form.Group controlId="formSessionDuration" className="row col-6 ps-2">
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
                                                    <Dropdown.Item key={unit} onClick={() => setDurationUnit(unit)}>
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