/*global chrome*/
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function URLList() {
    const [urls, setUrls] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [editing, setEditing] = useState(false);

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
    const handleDelete = (url) => {
        const newUrls = urls.filter((u) => u.url !== url);
        setUrls(urls.filter((u) => u.url !== url));
        chrome.storage?.sync.set({ "blockedurls": newUrls });
        if (newUrls.length === 0) {
            setEditing(false);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            const newInput = { "url": inputText };
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
                {urls.length !== 0 && <Table className="table-url">
                    <thead>
                        <tr>
                            <th scope="col">URL</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url, index) =>
                            <tr key={index} className="w-100">
                                <td className="w-50 table-primary-col">{url.url}</td>
                                <td className="w-25"></td>
                                <td className="w-25">
                                    <div style={editing ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                                        <OverlayTrigger
                                            placement='bottom' overlay={
                                                <Tooltip id='tooltip-bottom'>
                                                    Delete
                                                </Tooltip>
                                            }
                                        >
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(url.url)}>
                                                <i className="bi bi-trash" text-></i>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </td>
                            </tr>)}
                    </tbody>
                </Table>}
                {urls.length === 0 && <></>}
                <Row className="align-items-center">
                    <Form onSubmit={handleSubmit} onChange={(e) => {
                        setInputText(e.target.value);
                        setIsFormValid(Boolean(e.target.value.match(URL_REGEX)));
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
}