import { React, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const initialListState = {
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
}

export default function TaskLists() {
    // const [lists, setLists] = useState([]);
    const [editingLists, setEditingLists] = useState(false);
    const [listFormInput, setlistFormInput] = useState("");
    const [lists, setLists] = useState(initialListState);

    useEffect(() => {
        if (Object.keys(lists).length === 0) {
            setEditingLists(true);
        }
    }, [lists]);
    const createNewTaskList = () => {
        setEditingLists(!editingLists);
    }

    const editTaskList = (listName) => {
        // TODO
        console.log(`edit-tasklist button clicked for list '${listName}'`);
    }

    const updateTaskStatus = (listName, taskName, prevTaskStatus) => {
        console.log(`updateTaskStatus() called for task '${taskName}' in list '${listName}'`)
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

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
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
            <Collapse in={editingLists}>
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
                        <Accordion flush
                            key={accordianKey} className="mb-2"
                        >
                            <Accordion.Item eventKey={index} key={listName}>
                                <Accordion.Header className="accordian-header-btn-text-swap">
                                    <span className="text-lg">
                                        {listName}
                                    </span>
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
                                                    <div className="mb-1" key={taskKey}>
                                                        {/* Note: 'id' assumes that no two tasks in a given list share a name */}
                                                        <input type="checkbox" checked={isTaskDone}
                                                            id={inputKey} className="mx-2"
                                                            onChange={() => updateTaskStatus(listName, taskName, isTaskDone)}
                                                        />
                                                        <label type="checkbox" className="text-md"
                                                            htmlFor={inputKey}
                                                        >
                                                            {taskName}
                                                        </label>
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
                                        onClick={() => {
                                            setLists((prevLists) => {
                                                return {
                                                    ...prevLists,
                                                    [listName]: {
                                                        ...prevLists[listName],
                                                        ["adding"]: !prevLists[listName]["adding"]
                                                    }
                                                }
                                            })
                                        }}
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
                                                                setLists((prevLists) => {
                                                                    return {
                                                                        ...prevLists,
                                                                        [listName]: {
                                                                            ...prevLists[listName],
                                                                            ["addFormInput"]: e.target.value,
                                                                        }
                                                                    }
                                                                })
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