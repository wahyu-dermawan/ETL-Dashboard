<script lang="ts">
  // Import necessary Svelte and utility functions
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { jobDetails, getJobLoadAnalysis } from '$lib/dummyData';
  import { format, parseISO } from 'date-fns';

  // Reactive declarations to get job details from route parameters
  $: jobId = $page.params.id;
  $: job = jobDetails[jobId];
  $: jobExists = !!job;

  // State variables for chart and analysis controls
  let selectedLoadId: string | null = null;
  let selectedPeriod: 'day' | 'week' | 'month' = 'week';
  let chartCanvas: HTMLCanvasElement;
  let chart: any = null;
  let showChart = false;
  

  // Function to format date strings
  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  // Function to determine CSS class based on job status
  function getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'completed';
      case 'failed': return 'failed';
      case 'running': return 'running';
      default: return '';
    }
  }

  // Asynchronous function to initialize the chart
  async function initChart() {
    // Check if we're in a browser environment (for SSR compatibility)
    if (!browser) return;

    // Dynamically import Chart.js and plugins
    const { Chart, registerables } = await import('chart.js/auto');
    const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
    await import('chartjs-adapter-date-fns');

    // Register Chart.js components and plugins
    Chart.register(...registerables, zoomPlugin);

    // Check if all required data is available
    if (!jobExists || !job || !selectedLoadId || !chartCanvas) {
      console.warn('Cannot update chart: missing required data');
      return;
    }

    // Fetch analysis data for the selected load and period
    const analysisData = getJobLoadAnalysis(job.id, selectedLoadId, selectedPeriod);
    console.log('Analysis Data:', analysisData);

    if (!analysisData || analysisData.length === 0) {
      console.warn('No analysis data available');
      return;
    }

    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }

      // Ensure all dates are valid Date objects
    const labels = analysisData.map(d => {
      if ('date' in d) {
        // For daily data
        return new Date(d.date).toISOString();
      }
      // For weekly/monthly data
      return d.period;
    });


    const recordsProcessedData = analysisData.map(d => d.recordsProcessed);
    const throughputData = analysisData.map(d => 'throughput' in d ? d.throughput : d.averageThroughput);

    // Chart configuration
    const chartConfig = {
    type: 'bar' as const,
    data: {
      labels,
      datasets: [
        {
          label: 'Records Processed',
          data: recordsProcessedData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: 'Throughput (records/minute)',
          data: throughputData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          type: 'line' as const,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          type: selectedPeriod === 'day' ? 'time' : 'category',
          time: {
            unit: selectedPeriod === 'day' ? 'day' : undefined,
            displayFormats: {
              day: 'yyyy-MM-dd'
            }
          },
          title: {
            display: true,
            text: selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1),
          },
        },
        y1: {
          type: 'logarithmic' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Records Processed (log scale)',
          },
          ticks: {
            callback: function(value) {
              if (value === 10 || value === 100 || value === 1000 || value === 10000 || value === 100000 || value === 1000000) {
                return this.getLabelForValue(value as number);
              }
            }
          }
        },
        y2: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Throughput (records/minute)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            title: function(context) {
              const label = context[0].label;
              if (selectedPeriod === 'day') {
                return format(new Date(label), 'yyyy-MM-dd');
              }
              return label;
            },
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(2);
                if (context.datasetIndex === 1) {
                  label += ' records/minute';
                }
              }
              return label;
            }
          }
        },
        legend: {
          position: 'top' as const,
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
        }
      },
    },
  };

  chart = new Chart(chartCanvas, chartConfig);
}

  // Function to handle "View Analysis" button click
  function viewAnalysis(loadId: string) {
    selectedLoadId = loadId;
    showChart = true;
    if (browser) {
      initChart();
    }
  }

  // Lifecycle hook to set initial selected load
  onMount(() => {
    if (jobExists && job && job.jobLoads.length > 0) {
      selectedLoadId = job.jobLoads[0].loadId;
    }
  });

  // Function to hide the chart
  function hideChart() {
    showChart = false;
  }

  // Reactive statement to reinitialize chart when dependencies change
  $: if (browser && showChart && selectedLoadId && selectedPeriod) {
    initChart();
  }
</script>

<!-- Set the page title dynamically based on job existence and name -->
<svelte:head>
  <title>Job Details - {jobExists && job ? job.name : 'Not Found'}</title>
</svelte:head>

<main>
  <!-- Header section with job name and back button -->
  <header>
    <h1>Job Details: {jobExists && job ? job.name : 'Not Found'}</h1>
    <button class="back-button" on:click={() => history.back()}>Back To Dashboard</button>
  </header>

  <!-- Conditional rendering based on job existence -->
  {#if !jobExists || !job}
    <p>Job not found or no details available for ID: {jobId}</p>
  {:else}
    <!-- Job Information Section -->
    <div class="job-info">
      <h2>Job Information</h2>
      <div class="table-container">
        <table>
          <!-- Table rows for job details -->
          <tr><th>Job ID:</th><td>{job.id}</td></tr>
          <tr><th>Job Run ID:</th><td>{job.jobRunId}</td></tr>
          <tr><th>Yarn App ID:<td>{job.yarnId}</td></tr>
          <tr><th>Description:</th><td>{job.description}</td></tr>
          <tr><th>Tier:</th><td>{job.tier}</td></tr>
          <tr><th>Cluster:</th><td>{job.cluster}</td></tr>
          <tr><th>Status:</th><td class={getStatusClass(job.status)}>{job.status}</td></tr>
          <tr><th>Start Time:</th><td>{formatDate(job.startTime)}</td></tr>
          <tr><th>End Time:</th><td>{job.endTime ? formatDate(job.endTime) : 'N/A'}</td></tr>
          <tr><th>Duration:</th><td>{job.duration}</td></tr>
          <tr><th>PIC:</th><td>{job.pic}</td></tr>
          <tr><th>Records Processed:</th><td>{job.recordsProcessed.toLocaleString()}</td></tr>
          <tr><th>Error Message:</th><td>{job.errorMessage || 'None'}</td></tr>
          <tr><th>Source System:</th><td>{job.sourceSystem}</td></tr>
          <tr><th>Target System:</th><td>{job.targetSystem}</td></tr>
        </table>
      </div>
    </div>

    <!-- Job Loads Section -->
    <div class="job-loads">
      <h2>Job Loads</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Load Run ID</th>
              <th>Load ID</th>
              <th>Target Table</th>
              <th>Status</th>
              <th>Output Row Count</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iterate over job loads and display each as a table row -->
            {#each job.jobLoads as load}
              <tr>
                <td>{load.loadRunId}</td>
                <td>{load.loadId}</td>
                <td>{load.targetTable}</td>
                <td class={getStatusClass(load.status)}>{load.status}</td>
                <td>{load.outputRowCount.toLocaleString()}</td>
                <td>{formatDate(load.startTime)}</td>
                <td>{load.duration}</td>
                <td>
                  <button on:click={() => viewAnalysis(load.loadId)}>View Analysis</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Load Analysis Chart Section (conditionally rendered) -->
    {#if showChart}
      <div class="load-analysis">
        <h2>Load Analysis</h2>
        <button class="close-button" on:click={hideChart}>Close Analysis</button>
        <div>
          <!-- Dropdown to select a specific load -->
          <label for="load-select">Select Load:</label>
          <select id="load-select" bind:value={selectedLoadId} on:change={() => viewAnalysis(selectedLoadId)}>
            {#each job.jobLoads as load}
              <option value={load.loadId}>
                Load {load.loadId} - {load.targetTable}
              </option>
            {/each}
          </select>

          <!-- Dropdown to select time period for analysis -->
          <label for="period-select">Select Period:</label>
          <select id="period-select" bind:value={selectedPeriod}>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>

        <!-- Canvas element for rendering the chart -->
        <div style="height: 400px;">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  /* Main container styles */
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  /* Header styles */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  /* Heading styles */
  h1, h2 {
    color: #333;
    margin-bottom: 20px;
  }

  /* Back button styles */
  .back-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  /* Section spacing */
  .job-info, .job-loads, .load-analysis {
    margin-bottom: 30px;
  }

  /* Table container for horizontal scrolling on small screens */
  .table-container {
    overflow-x: auto;
  }

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  /* Status color coding */
  .completed { color: #4CAF50; }
  .failed { color: #F44336; }
  .running { color: #2196F3; }

  /* Button styles */
  button {
    cursor: pointer;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
  }

  button:hover {
    background-color: #45a049;
  }

  /* Close button specific styles */
  .close-button {
    background-color: #f44336;
  }

  .close-button:hover {
    background-color: #d32f2f;
  }

  /* Form control styles */
  select {
    margin: 10px;
    padding: 5px;
  }

  /* Chart canvas styles */
  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  /* Responsive design for mobile devices */
  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: flex-start;
    }

    .back-button {
      margin-top: 10px;
    }
  }
</style>