import { BarChart, XAxis, YAxis, Label, Bar, LabelList, CartesianGrid, Tooltip } from 'recharts';
import { React, useState } from 'react';


export default function Dashboard() {
    const [sessionTime, setSessionTime] = useState(0);
    const [idleTime, setIdleTime] = useState(0);
    const [numBlockedVisited, setNumBlockedVisited] = useState(0);

    // sample data is an array of data "points"
    // each data "point" corresponds to a bar on the chart
    // (x-axis (url) and y-axis (minutes) variable can be named anything, so long as you pass those names to the Bar/Chart component)
    const graphData = [ // maybe we want to consider limiting the # bars to ~5?
        { url: 'url-A-here-are-some', minutes: 4000 },
        { url: 'url-B-here', minutes: 3000 },
        { url: 'url-C-here-are-some-words', minutes: 2000 },
        { url: 'url-D-here-are-some-words', minutes: 2780 },
        { url: 'url-E-here-are', minutes: 1890 }
    ];

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
        <div id="dashboard-summary" className="row mb-5">
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
                <Label value="URLs" offset={-10} position='insideBottom'/>
            </XAxis>
            <YAxis>
                <Label value="Time (min)" angle="-90" position='insideLeft' style={{textAnchor: 'middle'}}/>
            </YAxis>
            <Bar dataKey="minutes" fill={BAR_COLOR}>
                {/* uncomment below line to display 'minutes' values above bars */}
                {/* <LabelList dataKey="minutes" position="top"/> */}
            </Bar>
        </BarChart>
    </>
    );
}