// Define the URL variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and log it to the console
let data = d3.json(url).then(function(data) {
  console.log(data);

  // Populate the dropdown menu with IDs
  let dropdownMenu = d3.select("#selDataset");
  let sampleNames = data.names;
  sampleNames.forEach((name) => {
    dropdownMenu.append("option")
      .text(name)
      .property("value", name);
  });

  // Initialize the dashboard with the first sample
  let firstSample = sampleNames[0];
  buildBarPlot(firstSample, data);
  buildBubblePlot(firstSample, data);
  buildMetadata(firstSample, data);
});

// Function to build the metadata panel
function buildMetadata(sampleID, data) {
  // Filter the metadata from the JSON data to get values for the selected sample
  let metadata = data.metadata.filter(sample => sample.id == sampleID)[0];

  // Select the panel from the HTML with the ID 'sample-metadata'
  let panel = d3.select("#sample-metadata");

  // Clear the panel
  panel.html("");

  // Loop through each key in the metadata object and append data to the panel
  for (key in metadata) {
    panel.append("h6").text(`${key.toUpperCase()}: ${metadata[key]}`);
  }
}

// Function to build the bar plot
function buildBarPlot(sampleID, data) {
  // Filter the samples from the JSON data to get values for the selected sample
  let sampleArray = data.samples.filter(sample => sample.id == sampleID)[0];

  // Assign variables to sample values
  let otu_ids = sampleArray.otu_ids;
  let sample_values = sampleArray.sample_values;
  let otu_labels = sampleArray.otu_labels;

  // Set variables for plot values
  let trace1 = {
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  };

  // Define layout
  let layout = {
    title: "Top 10 OTUs Found in Belly Button",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // Call Plotly to plot the bar chart
  Plotly.newPlot("bar", [trace1], layout);
}

// Function to build the bubble plot
function buildBubblePlot(sampleID, data) {
  // Filter the samples from the JSON data to get values for the selected sample
  let sampleArray = data.samples.filter(sample => sample.id == sampleID)[0];

  // Assign variables to sample values
  let otu_ids = sampleArray.otu_ids;
  let sample_values = sampleArray.sample_values;
  let otu_labels = sampleArray.otu_labels;

  // Set variables for plot values
  let trace2 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  };

  // Define layout
  let layout = {
    title: "Belly Button Biodiversity",
    xaxis: { title: "OTU ID" }
  };

  // Call Plotly to plot the bubble chart
  Plotly.newPlot("bubble", [trace2], layout);
}

// Function that updates plots on change
function optionChanged(sampleID) {
  // Fetch the JSON data and log it to the console
  d3.json(url).then(function(data) {
    console.log(data);

    // Call functions to update the plots and metadata
    buildBarPlot(sampleID, data);
    buildBubblePlot(sampleID, data);
    buildMetadata(sampleID, data);
  });
}