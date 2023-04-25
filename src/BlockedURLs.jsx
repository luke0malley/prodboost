import React from 'react';
import URLList from './URLList';
import Accordion from 'react-bootstrap/Accordion';

export default function BlockedURLs({ onUrlListSizeChange }) {

    return (
        <Accordion defaultActiveKey="0" flush
            id="section-blocked-urls" className="mb-5"
        >
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <span className="text-lg">Blocked URLs</span>
                </Accordion.Header>
                <Accordion.Body>
                    <URLList onUrlListSizeChange={onUrlListSizeChange} />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}