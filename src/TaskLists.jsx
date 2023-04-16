/*global chrome*/
import { React, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

/* const initialListState = {
    "Task List One": {
        "adding": false, "addFormInput": "", "editing": false, "tasks":
        {
            "A task": false,
            "A second task": false,
            "A third task": false
        }
    },
    "Task List Two": {
        "adding": false, "addFormInput": "", "editing": false, "tasks":
            {}
    },
    "Task List Three": {
        "adding": false, "addFormInput": "", "editing": false, "tasks":
        {
            "Another task": false,
        }
    },
}*/

export default function TaskLists() {

    const [editingLists, setEditingLists] = useState(false);
    const [listFormInput, setlistFormInput] = useState("");
    const [lists, setLists] = useState({});

    useEffect(() => {
        chrome.storage?.sync.get(["taskLists"]).then((result) => {
            if (result["taskLists"]) {
                setLists(result["taskLists"]);
            }
            if (Object.keys(result["taskLists"]).length === 0) {
                setEditingLists(true);
            }
        })
    }, []);

    useEffect(() => {
        chrome.storage?.sync.set({ "taskLists": lists });
    }, [lists]);

    const createNewTaskList = () => {
        setEditingLists(!editingLists);
    }

    const editTaskList = (listName) => {
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listName]: {
                    ...prevLists[listName],
                    ["editing"]: !prevLists[listName]["editing"]
                }
            }
        })
    }

    const updateTaskStatus = (listName, taskName, prevTaskStatus) => {
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listName]: {
                    ...prevLists[listName],
                    "tasks": {
                        ...prevLists[listName]["tasks"],
                        [taskName]: !prevTaskStatus
                    }
                }
            }
        })
    }

    const handleListFormSubmit = (e) => {
        e.preventDefault();
        if (listFormInput === "") {
            return;
        }
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listFormInput]: {
                    "adding": false,
                    "addFormInput": "",
                    "editing": false,
                    "tasks": {}
                }
            }
        })
        setEditingLists(false);
        setlistFormInput("");
    }

    const handleListDelete = (listName) => {
        setLists((prevLists) => {
            const newLists = { ...prevLists };
            delete newLists[listName];
            if (Object.keys(newLists).length === 0) {
                setEditingLists(true);
            }
            return newLists;
        });
    }

    const handleListTaskDelete = (listName, taskName) => {
        setLists((prevLists) => {
            const newLists = { ...prevLists };
            delete newLists[listName]["tasks"][taskName];
            return newLists;
        })
    }

    const handleListTaskAdd = (listName) => {
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listName]: {
                    ["tasks"]: {
                        ...prevLists[listName]["tasks"],
                        [prevLists[listName]["addFormInput"]]: false
                    },
                    ["addFormInput"]: "",
                    ["adding"]: false,
                    ["editing"]: false
                }
            }
        })
    }

    const handleListAddTaskClicked = (listName) => {
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listName]: {
                    ...prevLists[listName],
                    ["adding"]: !prevLists[listName]["adding"]
                }
            }
        })
    }

    const handleListAddTaskInputChange = (listName, value) => {
        setLists((prevLists) => {
            return {
                ...prevLists,
                [listName]: {
                    ...prevLists[listName],
                    ["addFormInput"]: value,
                }
            }
        })
    }

    return (
        <>
            <div className="d-flex justify-content-end mb-2 px-4">
                <div role="button"
                    id="create-new-tasklist-button"
                    className="d-flex align-items-center gap-2"
                    onClick={createNewTaskList}
                >
                    <span className="text-md">
                        Create New List
                    </span>
                    <i className="bi bi-plus text-lg text-success" />
                </div>
            </div>
            <Collapse in={editingLists} className="px-4">
                <Row className="align-items-center">
                    <Form onSubmit={(submitEvent) => { handleListFormSubmit(submitEvent) }} className="d-flex flex-column gap-2">
                        <Form.Label htmlFor="form-add-list">Add New List</Form.Label>
                        <Form.Group
                            as={Col}
                            controlId="form-add-URL"
                        >
                            <div className="row mx-0 justify-content-between gap-2 mb-2">
                                <Form.Control
                                    className="w-75"
                                    value={listFormInput}
                                    onChange={(e) => {
                                        setlistFormInput(e.target.value);
                                    }}
                                    required
                                />
                                <Button variant="success" className="col-2" type="submit">
                                    Add List
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Row>
            </Collapse>

            {(lists.length === 0) &&
                <div className="text-center">
                    No task lists have been created...
                </div>
            }
            {lists &&
                Object.entries(lists).map((listEntry, index) => {
                    const listName = listEntry[0];
                    const tasks = listEntry[1]["tasks"];
                    const accordianKey = `${listName} Accordian`

                    return (
                        <Accordion flush defaultActiveKey="0"
                            key={accordianKey} className="mb-2"
                        >
                            <Accordion.Item eventKey={index} key={listName}>
                                <Accordion.Header className="accordian-header-btn-text-swap">
                                    <span className="text-lg">
                                        {listName}
                                    </span>
                                    <div className="" style={listEntry[1]["editing"] ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                                        <OverlayTrigger
                                            placement='bottom' overlay={
                                                <Tooltip id='tooltip-bottom'>
                                                    Delete
                                                </Tooltip>
                                            }
                                        >
                                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleListDelete(listName)}>
                                                <i className="bi bi-trash" text-></i>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {(Object.keys(tasks).length)
                                        ?
                                        <>
                                            {Object.entries(tasks).map((taskEntry) => {
                                                const taskName = taskEntry[0];
                                                const isTaskDone = taskEntry[1];
                                                const inputKey = listName + " " + taskEntry[0];
                                                const taskKey = "task " + inputKey;

                                                return (
                                                    <div className="mb-1 d-flex" key={taskKey}>
                                                        {/* Note: 'id' assumes that no two tasks in a given list share a name */}
                                                        <input type="checkbox" checked={isTaskDone}
                                                            id={inputKey} className="mx-2"
                                                            onChange={() => updateTaskStatus(listName, taskName, isTaskDone)}
                                                        />
                                                        <label type="checkbox" className="text-md d-flex align-items-center"
                                                            htmlFor={inputKey}
                                                        >
                                                            {taskName}
                                                        </label>
                                                        <div className="" style={listEntry[1]["editing"] ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                                                            <OverlayTrigger
                                                                placement='bottom' overlay={
                                                                    <Tooltip id='tooltip-bottom'>
                                                                        Delete
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleListTaskDelete(listName, taskName)}>
                                                                    <i className="bi bi-trash" text-></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <br />
                                                    </div>)
                                            })}
                                        </>
                                        :
                                        <div>
                                            This list has no tasks
                                        </div>
                                    }
                                    <div role="button"
                                        id="create-new-task-button"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() =>
                                            handleListAddTaskClicked(listName)}
                                    >
                                        <i className="bi bi-plus text-lg text-success" />
                                        <span className="text-md">
                                            Add Task
                                        </span>
                                    </div>
                                    <Collapse in={listEntry[1]["adding"]}>
                                        <Row className="align-items-center">
                                            <Form onSubmit={(submitEvent) => {
                                                submitEvent.preventDefault();
                                                handleListTaskAdd(listName);
                                            }} className="d-flex flex-column gap-2">
                                                <Form.Label htmlFor="form-add-list">Add New Task</Form.Label>
                                                <Form.Group
                                                    as={Col}
                                                    controlId="form-add-URL"
                                                >
                                                    <div className="row mx-0 justify-content-between gap-2 mb-2">
                                                        <Form.Control
                                                            className="w-75"
                                                            value={listEntry[1]["addFormInput"]}
                                                            onChange={(e) => {
                                                                handleListAddTaskInputChange(listName, e.target.value);
                                                            }}
                                                            required
                                                        />
                                                        <Button variant="success" className="col-2" type="submit">
                                                            Add Task
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                            </Form>
                                        </Row>
                                    </Collapse>
                                    <div role="button"
                                        id="edit-tasklist-button"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => editTaskList(listName)}
                                    >
                                        <i className="bi bi-pencil text-md ms-2 text-success" />
                                        <span className="text-md">
                                            Edit List
                                        </span>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )
                })}
        </>
    );
}