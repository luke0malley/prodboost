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
                            <th scope="col" className="p-1">URL</th>
                            <th scope="col" className="p-1">Time Added</th>
                            <th scope="col" className="p-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.length !== 0 && urls.map((url, index) => <tr key={index}>
                            <td className="p-1">{url.url}</td>
                            <td className="p-1">{moment(url.date).fromNow()}</td>
                            <td className="p-1">
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
                            <td className="p-1" >Nothing here yet...</td>
                            <td className="p-1">...</td>
                            <td className="p-1">...</td>
                        </tr>}
                    </tbody>
                </Table>
                <Row className="align-items-center">
                    <Form hasValidation onSubmit={handleSubmit} onChange={handleChange}>
                        <Form.Label htmlFor="form-add-URL">Add URL to Block</Form.Label>
                        <Form.Group
                            as={Col}
                            controlId="formValidation"
                        >
                            <Form.Control
                                className="mb-2"
                                id="form-add-URL"
                                placeholder="www.example.com"
                                isValid={formValidity !== "" ? formValidity === "true" : false}
                                isInvalid={formValidity !== "" ? formValidity === "false" : false}
                                value={inputText}
                            />
                        </Form.Group>
                        <Form.Group
                            as={Col}
                        >
                            <Button type="submit" className="mb-2">
                                Add URL
                            </Button>
                        </Form.Group>
                    </Form>
                </Row>
            </>
        )
    }
}