/*global chrome*/
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import normalizeUrl from 'normalize-url';

export default function URLList({ onUrlListSizeChange }) {
    const [urls, setUrls] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [editing, setEditing] = useState(false);

    // CHARS = set of valid URL characters
    const CHARS = "[-a-zA-Z0-9@:%_\+~#=]";
    const URL_REGEX = RegExp(`^(https?:\/\/)?${CHARS}+(\.${CHARS}+)*(\/${CHARS}*)*$`);

    useEffect(() => {
        chrome.storage?.sync.get(["blockedurls"]).then((result) => {
            if (result.blockedurls) {
                setUrls(result.blockedurls);
            }
        });
    }, []);

    const handleDelete = (url) => {
        setUrls(urls.filter((u) => u !== url));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            try {
                let newInput = normalizeUrl(inputText, { stripProtocol: true });
                if (newInput.indexOf("/", 8) !== -1) newInput = newInput.substring(0, newInput.indexOf("/", 8));
                if (newInput === "" || urls.includes(newInput)) {
                    setIsFormValid(false);
                    return
                }
                setUrls([...urls, newInput]);
                setInputText("");
                setIsFormValid(false);
            }
            catch {
                setIsFormValid(false);
                return;
            }
        }
    }
    useEffect(() => {
        chrome.storage?.sync.set({ "blockedurls": urls });
        if (urls.length === 0) {
            setEditing(false);
        }
        onUrlListSizeChange(urls.length);
    }, [urls]);

    return (
        <>
            {urls.length !== 0 &&
                urls.map((url, index) =>
                    <div className="hover-background-color d-flex justify-content-between align-items-center mb-1 px-2" key={"blocked-url-" + url}>
                        <div
                            className="cursor-pointer overflow-text-hide w-75"
                            onClick={(e) => e.currentTarget.classList.toggle('overflow-text-expand')}
                        >{url}</div>
                        <div style={{ visibility: editing ? 'visible' : 'hidden' }}>
                            <OverlayTrigger
                                placement='bottom' overlay={
                                    <Tooltip>Delete</Tooltip>
                                }
                            >
                                <Button variant="danger" size="sm" onClick={() => handleDelete(url)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </OverlayTrigger>
                        </div>
                    </div>
                )
            }
            {urls.length === 0 && <p>No URLs have been added.</p>}

            <Row className="align-items-center pt-4">
                <Form onSubmit={handleSubmit} onChange={(e) => {
                    setInputText(e.target.value);
                    try {
                        let newInput = normalizeUrl(e.target.value, { stripProtocol: true });
                        if (newInput.indexOf("/", 8) !== -1) newInput = newInput.substring(0, newInput.indexOf("/", 8));
                        setIsFormValid(Boolean(e.target.value.match(URL_REGEX) && !urls.includes(newInput)));
                    }
                    catch {
                        setIsFormValid(false);
                    }
                }}
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
                                onChange={() => { }}
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
                                {(inputText === "" || isFormValid) ? "" : "Please enter a valid URL"}
                            </label>
                            <Button
                                id="toggle-edit"
                                variant="secondary"
                                className="col-2"
                                onClick={(e) => setEditing(!editing)}
                                hidden={urls.length === 0}
                            >
                                Edit URLs
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Row>
        </>
    )
}