import React from 'react';
import List from "./List";

export default function Popup() {
    return (
        <>
            <div id="section-blocked-urls" class="d-flex flex-column gap-2">
                <h2 class="h5">Blocked URLs</h2>
                <List />
            </div>
        </>
    );
}