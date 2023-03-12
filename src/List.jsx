/*global chrome*/
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import moment from 'moment'

export default function List() {
    const [urls, setUrls] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [inputText, setInputText] = useState("");
    const [formValidity, setFormValidity] = useState("");

    useEffect(() => {
        chrome.storage?.sync.get(["blockedurls"]).then((result) => {
            if (result.blockedurls) {
                setUrls(result.blockedurls);
            }
        });
        setLoaded(true);
    }, []);
    const handleChange = (e) => {
        setInputText(e.target.value);
        if (formValidity === "false") {
            setFormValidity("true");
        }
    }
    const handleDelete = (url) => {
        const newUrls = urls.filter((u) => u.url !== url)
        setUrls(urls.filter((u) => u.url !== url))
        chrome.storage.sync.set({ "blockedurls": newUrls })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newInput = { "url": inputText, "date": new Date().toLocaleString() };
        if (inputText === "") {
            setFormValidity("false");
            return
        }
        const newUrls = [...urls, newInput];
        console.log(newUrls)
        setUrls([...urls, newInput]);
        chrome.storage.sync.set({ "blockedurls": newUrls }).then(() => {
            setInputText("");
            setFormValidity("");
        })
    }
    if (loaded) {
        return (
            <>
                <Table hover>
                    <thead>
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col">Time Added</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.length !== 0 && urls.map((url, index) => <tr key={index}>
                            <td>{url.url}</td>
                            <td>{moment(url.date).fromNow()}</td>
                            <td>
                                <OverlayTrigger placement='bottom' overlay={
                                    <Tooltip id='tooltip-bottom'>
                                        Delete
                                    </Tooltip>
                                }
                                >
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(url.url)}>
                                        <i className="bi-trash-fill"></i>
                                    </Button>
                                </OverlayTrigger>
                            </td>
                        </tr>)}
                        {urls.length === 0 && <tr>
                            <td >Nothing here yet...</td>
                            <td>...</td>
                            <td>...</td>
                        </tr>}
                    </tbody>
                </Table>
                <Row className="align-items-center">
                    <Form hasValidation onSubmit={handleSubmit} onChange={handleChange}
                        className="d-flex flex-column gap-2"
                    >
                        <Form.Label htmlFor="form-add-URL">Add URL to Block</Form.Label>
                        <Form.Group
                            as={Col}
                            controlId="formValidation"
                            className="d-flex row justify-content-between mx-0"
                        >
                            <Form.Control
                                className="w-75 mb-2"
                                id="form-add-URL"
                                placeholder="www.example.com"
                                isValid={formValidity !== "" ? formValidity === "true" : false}
                                isInvalid={formValidity !== "" ? formValidity === "false" : false}
                                value={inputText}
                            />
                            <Button variant="success" className="col-2" type="submit" onClick={() => console.log('add URL btn clicked')}>
                                Add URL
                            </Button>
                        </Form.Group>

                        <Button variant="secondary" className="col-2 align-self-end" type="button"
                            onClick={() => console.log('Edit URLs btn clicked')}
                        >
                            Edit URLs
                        </Button>
                    </Form>
                </Row>
            </>
        )
    }
}