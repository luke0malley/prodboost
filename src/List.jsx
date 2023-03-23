/*global chrome*/
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import moment from 'moment'

export default function List() {
    const [urls, setUrls] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [inputText, setInputText] = useState("");
    const [formValidity, setFormValidity] = useState("");
    const [checked, setChecked] = useState(false);

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
        if (e.target.value === "") {
            setFormValidity("");
        }
        else if (formValidity === "false") {
            setFormValidity("true");
        }
    }
    const handleDelete = (url) => {
        const newUrls = urls.filter((u) => u.url !== url)
        setUrls(urls.filter((u) => u.url !== url))
        chrome.storage?.sync.set({ "blockedurls": newUrls })
        if (newUrls.length === 0) {
            setChecked(false);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newInput = { "url": inputText, "date": moment().toISOString() };
        if (inputText === "") {
            setFormValidity("false");
            return
        }
        const newUrls = [...urls, newInput];
        setUrls([...urls, newInput]);
        chrome.storage?.sync.set({ "blockedurls": newUrls }).then(() => {
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
                        {urls.length !== 0 && urls.map((url, index) =>
                        <tr key={index} className="w-100">
                            <td className="w-50 table-primary-col">{url.url}</td>
                            <td className="w-25">{moment(url.date).fromNow()}</td>
                            <td className="w-25" style={checked ? { visibility: 'visible' } : { visibility: 'hidden' }}>
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
                        {urls.length === 0 &&
                        <tr className="w-100">
                            <td className="w-50">Nothing here yet...</td>
                            <td className="w-25">...</td>
                            <td className="w-25">...</td>
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
                            controlId="form-add-URL"
                            className="d-flex row justify-content-between mx-0"
                        >
                            <Form.Control
                                className="w-75 mb-2"
                                placeholder="www.example.com"
                                isValid={formValidity !== "" ? formValidity === "true" : false}
                                isInvalid={formValidity !== "" ? formValidity === "false" : false}
                                value={inputText}
                                onChange={() => {}}
                            />
                            <Button variant="success" className="col-2" type="submit">
                                Add URL
                            </Button>
                        </Form.Group>

                        <ToggleButton
                            id="toggle-edit"
                            variant="secondary"
                            className="col-2 align-self-end"
                            type="checkbox"
                            onChange={(e) => setChecked(e.currentTarget.checked)}
                            checked={checked}
                            hidden={urls.length === 0}
                        >
                            Edit URLs
                        </ToggleButton>
                    </Form>
                </Row>
            </>
        )
    }
}