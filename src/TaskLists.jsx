import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';


export default function TaskLists() {
    // const [lists, setLists] = useState([]);
    const [lists, setLists] = useState({
        // true/false = if task is "done" (used by checkbox)
        "Task List One": { "task1": true, "task2": false, "task3": false },
        "Task List Two": {},
        "Task List Three": { "task4": false },
    });

    const createNewTaskList = () => {
        // TODO
        console.log("create-new-tasklist button clicked!")
    }

    const editTaskList = (listName) => {
        // TODO
        console.log(`edit-tasklist button clicked for list '${listName}'`);
    }

    const createNewTask = (listName) => {
        // (listName like "Task List One")
        // TODO
        console.log(`create-new-task button clicked for list '${listName}'!`)
    }

    const updateTaskStatus = (listName, taskName, prevTaskStatus) => {
        // TODO
        console.log(`updateTaskStatus() called for task '${taskName}' in list '${listName}'`)
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
                    <i className="bi bi-plus text-lg text-success"/>
                </div>
            </div>

            {(lists.length === 0) &&
                <div className="text-center">
                    No task lists have been created...
                </div>
            }
            {lists &&
            Object.entries(lists).map((listEntry) => {
                const listName = listEntry[0];
                const tasks = listEntry[1];
                const accordianKey = `${listName} Accordian`

                return (
                <Accordion flush defaultActiveKey="0"
                    key={accordianKey} className="mb-2"
                >
                    <Accordion.Item eventKey="0" key={listName}>
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
                                    <div role="button"
                                        id="create-new-task-button"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => createNewTask(listName)}
                                    >
                                        <i className="bi bi-plus text-lg text-success"/>
                                        <span className="text-md">
                                            Add Task
                                        </span>
                                    </div>
                                    <div role="button"
                                        id="edit-tasklist-button"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => editTaskList(listName)}
                                    >
                                        <i className="bi bi-pencil text-md ms-2 text-success"/>
                                        <span className="text-md">
                                            Edit List
                                        </span>
                                    </div>
                                </>
                                :
                                <div>
                                    This list has no tasks
                                </div>
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                )
            })}
        </>
    );
}