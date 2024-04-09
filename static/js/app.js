// Define the URL variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and log it to the console
let data = d3.json(url).then(function(data) {
    console.log(data);
});

// Function to initialize the dashboard at startup
function init() {
    // Select the dropdown menu with the ID 'selDataset'
    let dropdownMenu = d3.select("#selDataset");
    // Populate the dropdown menu with IDs
    d3.json(url).then(function(data) {
        let sampleNames = data.names;
        // Iterate through the array to append each name to the dropdown menu
        sampleNames.forEach((name) => {
            dropdownMenu.append("option")
                .text(name)
                .property("value", name);
        });

        // Call the first sample from the list
        let firstSample = sampleNames[0];

        // Call functions to initialize the first plots and metadata
        buildBarPlot(firstSample);
        buildBubblePlot(firstSample);
        buildMetadata(firstSample);
    });
};

// Call the init function to initialize the dashboard
init();

// Function to build the metadata panel
function buildMetadata(sampleID) {
    // Call the JSON data
    d3.json(url).then(function(data) {
        let metadata = data.metadata;

        // Filter data to get values for the selected sample
        let sampleArray = metadata.filter(sample => sample.id == sampleID);
        // Set the first object in the sample array to a variable
        let sample = sampleArray[0];

        // Select the panel from HTML and set it to a variable
        let panel = d3.select("#sample-metadata");
        panel.html("");
        // Loop through each key and append data to the panel
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase() + ": " + sample[key])
        }
    })
}

// Function to build the bar plot
function buildBarPlot(sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

        // Filter data to get values for the selected sample
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        // Assign variables to sample values
        let otu_ids = sample.otu_ids;
        let sample_values = sample.sample_values;
        let otu_labels = sample.otu_labels;

        // Set variables for plot values
        let trace1 = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        // Define layout
        let layout = {
            title: ""
        };

        // Call Plotly to plot 
        Plotly.newPlot("bar", trace1, layout)
    });
};

// Function to build the bubble plot
function buildBubblePlot(sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

        // Filter data to get values for the selected sample
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        // Assign variables to sample values
        let otu_ids = sample.otu_ids;
        let sample_values = sample.sample_values;
        let otu_labels = sample.otu_labels;

        // Set variables for plot values
        let trace2 = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        // Define layout
        let layout = {
            xaxis: { title: "OTU ID" }
        };

        // Call Plotly to plot
        Plotly.newPlot("bubble", trace2, layout)
    });
};

// Function that updates plots on change
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    buildBarPlot(sampleID);
    buildBubblePlot(sampleID);
};
