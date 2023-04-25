/*global chrome*/
import { BarChart, XAxis, YAxis, Label, Bar, /*LabelList, CartesianGrid,*/ Tooltip } from 'recharts';
import { React, useState, useEffect } from 'react';


export default function Dashboard() {
    const [sessionTime, setSessionTime] = useState(0);
    const [idleTime, setIdleTime] = useState(0);
    const [numBlockedVisited, setNumBlockedVisited] = useState(0);

    // sample data is an array of data "points"
    // each data "point" corresponds to a bar on the chart
    // (x-axis (url) and y-axis (seconds) variable can be named anything, so long as you pass those names to the Bar/Chart component)
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        chrome.storage?.sync.get(["session_history"]).then((result) => {
            if (result.session_history) {
                setSessionTime(result.session_history.session_length);
                setIdleTime(result.session_history.idle_time);
                const urls = Object.entries(result.session_history.history);
                const sortedUrls = urls.sort((a, b) => b[1] - a[1]);
                const top5urls = sortedUrls.slice(0, 5);
                setGraphData(top5urls.map(([url, seconds]) => ({
                    url,
                    seconds,
                })));
                setNumBlockedVisited(result.session_history.blocked_visited)
            }
        });
    }, []);

    const BAR_COLOR = "#198754"; // from CSS custom property 'bs-success'

    const formatlgabel = (value) => {
        // used by bar chart to format x-axis labels

        // truncate label text
        const CHAR_LIMIT = 13;
        if (value.length < CHAR_LIMIT) return value;
        return `${value.substring(0, CHAR_LIMIT)}...`;
    };

    return (
        <>
            {graphData.length === 0 && <div className="text-center">
                Start a blocking session to see insights on your productivity.
            </div>}
            {graphData.length !== 0 && <div><div id="dashboard-summary" className="row mb-5">
                <div className="col-4">
                    <p className="text-md text-center">Session Length (min)</p>
                    <p className="text-lg text-center text-success">{sessionTime}</p>
                </div>
                <div className="col-4">
                    <p className="text-md text-center">Idle Time (min)</p>
                    <p className="text-lg text-center text-warning">{idleTime}</p>
                </div>
                <div className="col-4">
                    <p className="text-md text-center">Blocked Sites Visited</p>
                    <p className="text-lg text-center text-danger">{numBlockedVisited}</p>
                </div>
            </div>
                <label htmlFor="url-time-chart" className="text-center w-100 mb-2 mt-2">
                    Top Sites Used During Session
                </label>
                <BarChart
                    id="url-time-chart"
                    data={graphData}
                    width={550} height={300}
                    margin={{ top: 20, left: 10, bottom: 20 }}
                    barSize={50}
                    className="mb-5"
                >

                    {/* uncomment below 2 lines to enable grid or tooltip over bars, respectively */}
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <Tooltip />

                    <XAxis dataKey="url" tickFormatter={formatlgabel}>
                        <Label value="URLs" offset={-10} position='insideBottom' />
                    </XAxis>
                    <YAxis>
                        <Label value="Time (seconds)" angle="-90" position='insideLeft' style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Bar dataKey="seconds" fill={BAR_COLOR}>
                        {/* uncomment below line to display 'seconds' values above bars */}
                        {/* <LabelList dataKey="seconds" position="top"/> */}
                    </Bar>
                </BarChart></div>}
        </>
    );
}