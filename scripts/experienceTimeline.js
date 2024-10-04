// timeline.js

/**
 * Represents a data point on the timeline.
 * @typedef {Object} TimelineDataPoint
 * @property {string} date - The date of the event (format: 'YYYY-MM-DD').
 * @property {string} type - The type of the event ('achievement' or 'course').
 * @property {string} title - The title of the event.
 * @property {string} description - A brief description of the event.
 * @property {number} competence - The competence level associated with this event (0-100).
 */


/** @type {TimelineDataPoint[]} */
const timelineData = [
    { date: '2016-10-01', endDate: '2021-09-23', type: 'achievement', title: 'Master Degree in Psychology', description: 'Started my studies at the University of Wrocław', competence: 10 },
    { date: '2018-05-01', type: 'achievement', title: 'Originator of the Neuropsychology Student Club “Cerebro”', description: 'Founded and led a student club to explore neuropsychology', competence: 20 },
    { date: '2019-04-01', type: 'course', title: 'Neuropsychology Seminar "Mózg Aktywny"', description: 'Attended a neuropsychology seminar organized by the Polish Psychological Society', competence: 30 },
    { date: '2020-01-01', type: 'achievement', title: 'Psychologist at Foundation "Opieka i Troska"', description: '(Neuro)psychological diagnosing and therapy with patients at various life stages', competence: 40 },
    { date: '2021-01-01', type: 'achievement', title: 'Psychologist at Psychological-Pedagogical Counseling Center', description: 'Diagnosed and supported the development of cognitive, emotional, and social skills in individuals aged 3 to 19', competence: 50 },
    
    { date: '2021-10-01', type: 'achievement', title: 'Postgraduate Studies: UX & Product Design', description: 'Started postgraduate studies at SWPS University in UX & Product Design', competence: 55 },
    { date: '2021-11-26', type: 'course', title: 'Aspects of Neuroscience', description: 'Contributed to the development of "Telepathy.jl" for EEG data analysis', competence: 70 },
    { date: '2022-03-25', type: 'course', title: 'Brainhack Warsaw 2022', description: 'Contributed to the development of "Telepathy.jl" for EEG data analysis', competence: 70 },
    { date: '2022-10-15', type: 'course', title: 'Brainhack Krakow 2022', description: 'Analyzed data from a Muse device and smartwatches to identify the best wearable for capturing cognitive effort in behavior-change interventions', competence: 75 },
    { date: '2022-10-15', type: 'course', title: 'NEURONUS 2022 Neuroscience Forum', description: 'Participated in the NEURONUS Neuroscience Forum', competence: 80 },
    { date: '2023-04-01', type: 'course', title: 'BCI & Neurotechnology Spring School', description: 'Completed a course on BCI & Neurotechnology at g.tec', competence: 85 },
    { date: '2023-07-01', type: 'course', title: 'Neuromatch Academy', description: 'Completed a Computational Neuroscience course with a project on machine learning and mouse behavior', competence: 90 },
    { date: '2024-10-01', type: 'achievement', title: 'Master’s Degree in Research in Cognitive Science', description: 'Started a Master’s degree at Adam Mickiewicz University in Poznań', competence: 100 }
];
// neuronus 15-17.10
// neurohack krakow 21-23.10.22
// brainhack warsaw 25.03.22
// aspects of neurosci 26-28.11

/**
 * Creates and renders the interactive timeline visualization.
 * This function sets up the SVG, scales, axes, and data visualization elements.
 */

/**
 * Adds duration lines for events that have an endDate.
 * The line connects the 'date' and 'endDate' with the same curve as the main timeline path.
 * @param {d3.Selection} g - The D3 selection for the main SVG group.
 * @param {d3.ScaleTime} x - The x-scale for the chart.
 * @param {d3.ScaleLinear} y - The y-scale for the chart.
 * @param {TimelineDataPoint[]} data - The timeline data array.
 */
function addDurationLines(g, x, y, data) {
    // Filter data points that have an endDate
    const dataWithEndDate = data.filter(d => d.endDate);

    // Define the line generator to connect 'date' and 'endDate'
    const durationLine = d3.line()
        .x(d => x(new Date(d.date))) // Use the start date for the x position
        .y(d => y(d.competence)) // Use the competence level for the y position
        .curve(d3.curveMonotoneX); // Ensure the same curve as the main path

    // Loop through each data point with an endDate to create duration lines
    dataWithEndDate.forEach(d => {
        // Create the line connecting the date and endDate
        const extendedData = [
            { date: d.date, competence: d.competence },
            { date: d.endDate, competence: d.competence } // Maintain the same competence at endDate
        ];

        g.append('path')
            .datum(extendedData)
            .attr('class', 'duration-line')
            .attr('d', durationLine) // Apply the line generator
            .style('stroke', 'yellow')
            .style('stroke-width', 4) // Twice the width of the main path
            .style('opacity', 0.5)
            .style('fill', 'none');
    });
}

function createTimeline() {
   const container = d3.select('#timeline-container');
   
   // Remove any existing SVG to prevent duplicates on resize
   container.selectAll("svg").remove();
   
   const svg = container.append('svg')
       .attr('width', '100%')
       .attr('height', '100%');

   const margin = {top: 40, right: 60, bottom: 100, left: 60};
   const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
   const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;

   const g = svg.append('g')
       .attr('transform', `translate(${margin.left},${margin.top})`);

   const timeDomain = extendTimeDomain(timelineData);

   const x = d3.scaleTime()
       .domain(timeDomain)
       .range([0, width]);

   const y = d3.scaleLinear()
       .domain([0, 100])
       .range([height, 0]);

   // Format the date as DD-MM-YYYY
   const formatDate = d3.timeFormat("%d-%m-%Y");

    // Add X axis with ticks and labels
    g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickValues(timelineData.map(d => new Date(d.date))) // Set ticks only for data points
            .tickSize(5)
            .tickFormat(d3.timeFormat("%d-%m-%Y")) // Format the date as DD-MM-YYYY
        );

    // Rotate X axis labels
    g.selectAll('.x-axis text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');

   // Rotate X axis labels
   g.selectAll('.x-axis text')
       .attr('transform', 'rotate(-45)')
       .style('text-anchor', 'end')
       .attr('dx', '-.8em')
       .attr('dy', '.15em');

   // Add Y axis with ticks
   g.append('g')
       .attr('class', 'y-axis')
       .call(d3.axisLeft(y)
           .tickSize(5)
           .tickFormat(d => `${d}%`));

   // Add grid
   addGrid(g, width, height, x, y);

   // Create and add the timeline path
   addTimelinePath(g, x, y, timelineData, timeDomain);
   addDurationPath(g, timelineData, x, y);
   // Add interactive circles for each data point
   addDataPoints(g, x, y, timelineData);
}
/**
 * Extends the time domain of the data by 20% on both sides.
 * @param {TimelineDataPoint[]} data - The timeline data array.
 * @returns {Date[]} An array of two Date objects representing the extended domain.
 */
function extendTimeDomain(data) {
    const timeDomain = d3.extent(data, d => new Date(d.date));
    const timeRange = timeDomain[1] - timeDomain[0];
    return [
        new Date(timeDomain[0].getTime() - timeRange * 0.2),
        new Date(timeDomain[1].getTime() + timeRange * 0.2)
    ];
}

/**
 * Adds a delicate grid to the background of the chart.
 * @param {d3.Selection} g - The D3 selection for the main SVG group.
 * @param {number} width - The width of the chart area.
 * @param {number} height - The height of the chart area.
 * @param {d3.ScaleTime} x - The x-scale for the chart.
 * @param {d3.ScaleLinear} y - The y-scale for the chart.
 */
function addGrid(g, width, height, x, y) {
    const numVerticalLines = Math.floor(width / (height / 10));
    
    g.append('g')
        .attr('class', 'grid vertical-grid')
        .selectAll('line')
        .data(x.ticks(numVerticalLines))
        .enter().append('line')
        .attr('x1', d => x(d))
        .attr('y1', 0)
        .attr('x2', d => x(d))
        .attr('y2', height);

    g.append('g')
        .attr('class', 'grid horizontal-grid')
        .selectAll('line')
        .data(y.ticks(10))
        .enter().append('line')
        .attr('x1', 0)
        .attr('y1', d => y(d))
        .attr('x2', width)
        .attr('y2', d => y(d));

    // Add subtle lines ON the X and Y axes
    g.select('.x-axis').selectAll('.tick')
        .append('line')
        .attr('class', 'axis-tick-line')
        .attr('y2', -height)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5);

    g.select('.y-axis').selectAll('.tick')
        .append('line')
        .attr('class', 'axis-tick-line')
        .attr('x2', width)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5);
}

/**
 * Creates and adds the smooth timeline path to the chart.
 * @param {d3.Selection} g - The D3 selection for the main SVG group.
 * @param {d3.ScaleTime} x - The x-scale for the chart.
 * @param {d3.ScaleLinear} y - The y-scale for the chart.
 * @param {TimelineDataPoint[]} data - The timeline data array.
 * @param {Date[]} timeDomain - The extended time domain.
 */
function addTimelinePath(g, x, y, data, timeDomain) {
    const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.competence))
        .curve(d3.curveMonotoneX);

    const extendedData = [
        {date: timeDomain[0], competence: data[0].competence, type: 'extension'},
        ...data,
        {date: timeDomain[1], competence: data[data.length - 1].competence, type: 'extension'}
    ];

    g.append('path')
        .attr('class', 'timeline-path')
        .datum(extendedData)
        .attr('d', line);
}

/**
 * Adds interactive data points (circles) to the chart.
 * @param {d3.Selection} g - The D3 selection for the main SVG group.
 * @param {d3.ScaleTime} x - The x-scale for the chart.
 * @param {d3.ScaleLinear} y - The y-scale for the chart.
 * @param {TimelineDataPoint[]} data - The timeline data array.
 */
function addDataPoints(g, x, y, data) {
    const dataPoints = g.selectAll('.data-point')
        .data(data)
        .enter().append('g')
        .attr('class', 'data-point')
        .attr('transform', d => `translate(${x(new Date(d.date))},${y(d.competence)})`);

    dataPoints.append('circle')
        .attr('class', d => `timeline-circle ${d.type}`)
        .attr('r', 8)
        .on('click', (event, d) => showInfo(event, d, g, x, y));
}

/**
 * Displays information about a data point when clicked.

/**
 * Displays information about a data point when clicked.
 * @param {MouseEvent} event - The mouse click event.
 * @param {TimelineDataPoint} d - The data point associated with the clicked circle.
 * @param {d3.Selection} g - The D3 selection for the main SVG group.
 * @param {d3.ScaleTime} x - The x-scale for the chart.
 * @param {d3.ScaleLinear} y - The y-scale for the chart.
 */
function showInfo(event, d, g, x, y) {
    const container = d3.select('#timeline-container');
    g.selectAll('.info-line').remove();
    container.selectAll('.info-box').remove();

    const circleX = x(new Date(d.date));
    const circleY = y(d.competence);

    g.append('line')
        .attr('class', 'info-line')
        .attr('x1', circleX)
        .attr('y1', circleY)
        .attr('x2', circleX)
        .attr('y2', circleY)
        .transition()
        .duration(500)
        .attr('y2', 0);

    const infoBox = container.append('div')
        .attr('class', 'info-box')
        .style('opacity', 0)
        .style('left', `${circleX + 60 - 100}px`)
        .style('top', '40px')
        .html(`
            <h3>${d.title}</h3>
            <p>${d.description}</p>
            <p>Competence: ${d.competence}%</p>
            <img src="/api/placeholder/180/100" alt="${d.title}" />
        `);

    infoBox.transition()
        .duration(500)
        .style('opacity', 1);
}

// Function to handle window resize
function handleResize() {
    createTimeline();
}

// Initialize the timeline and add resize event listener
document.addEventListener('DOMContentLoaded', () => {
    createTimeline();
    window.addEventListener('resize', handleResize);
});