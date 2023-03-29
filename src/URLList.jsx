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

export default function URLList() {
    const [urls, setUrls] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [checked, setChecked] = useState(false);

    // CHARS = set of valid URL characters
    const CHARS = "[-a-zA-Z0-9@:%_\+~#=]";
    const URL_REGEX = `^(https?:\/\/)?${CHARS}+(\.${CHARS}+)*(\/${CHARS}*)*$`;

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
        setIsFormValid(Boolean(e.target.value.match(URL_REGEX)));
    }
    const handleDelete = (url) => {
        const newUrls = urls.filter((u) => u.url !== url);
        setUrls(urls.filter((u) => u.url !== url));
        chrome.storage?.sync.set({ "blockedurls": newUrls });
        if (newUrls.length === 0) {
            setChecked(false);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            const newInput = { "url": inputText, "date": moment().toISOString() };
            const newUrls = [...urls, newInput];
            setUrls([...urls, newInput]);
            chrome.storage?.sync.set({ "blockedurls": newUrls }).then(() => {
                setInputText("");
                setIsFormValid(false);
            })
        }
    }
    if (loaded) {
        return (
            <>
                <Table hover className="table-url">
                    <thead>
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col">Time Added</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.length !== 0 && urls.map((url, index) =>
                        <tr key={index} className="w-100 cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('table-row-expanded')}>
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
                        >
                            <div className="row mx-0 justify-content-between gap-2 mb-2">
                                <Form.Control
                                    className="w-75"
                                    placeholder="www.example.com"
                                    isValid={inputText === "" ? false : isFormValid}
                                    isInvalid={inputText === "" ? false : !isFormValid}
                                    value={inputText}
                                    onChange={() => {}}
                                    required
                                />
                                <Button variant="success" className="col-2" type="submit" disabled={!isFormValid}>
                                    Add URL
                                </Button>
                            </div>
                            <div className="row mx-0 justify-content-between gap-2">
                                <label
                                    htmlFor="form-add-URL"
                                    className="w-75 d-flex form-feedback-invalid"
                                >
                                    { (inputText === "" || isFormValid) ? "" : "Please enter a valid URL" }
                                </label>
                                <ToggleButton
                                    id="toggle-edit"
                                    variant="secondary"
                                    className="col-2"
                                    type="checkbox"
                                    onChange={(e) => setChecked(e.currentTarget.checked)}
                                    checked={checked}
                                    hidden={urls.length === 0}
                                >
                                    Edit URLs
                                </ToggleButton>
                            </div>
                        </Form.Group>
                    </Form>
                </Row>
            </>
        )
    }
}