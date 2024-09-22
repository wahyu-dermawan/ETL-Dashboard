<script lang="ts">
  // Import necessary dependencies
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { 
    getErrorAnalysisData, 
    getErrorClusterDetails,
    type DetailedErrorJob
  } from '$lib/dummyData';
  import { goto } from '$app/navigation';

  // Define types for time range and tier selections
  type TimeRange = 'today' | 'week' | 'month';
  type Tier = 'tier2' | 'tier3';

  // Initialize state variables
  let timeRange: TimeRange = 'week';
  let tier: Tier = 'tier2';
  let selectedCluster: string | null = null;
  let errorChart: Chart | null = null;
  let selectedErrorType: string | null = null;
  let detailedErrorJobs: DetailedErrorJob[] = [];

  // Reactive statement to update error analysis data when tier or timeRange changes
  $: currentErrorAnalysisData = getErrorAnalysisData(tier, timeRange);

  // Reactive statement to update chart when error analysis data changes
  $: {
    if (errorChart) {
      updateChart();
    }
  }

  // Handler for time range change
  function handleTimeRangeChange(range: TimeRange) {
    timeRange = range;
    selectedErrorType = null;
    detailedErrorJobs = [];
    updateChart();
  }

  // Handler for tier change
  function handleTierChange(newTier: Tier) {
    tier = newTier;
    selectedErrorType = null;
    detailedErrorJobs = [];
    updateChart();
  }

  // Function to update the chart with new data
  function updateChart() {
    if (errorChart) {
      errorChart.data.labels = Object.keys(currentErrorAnalysisData);
      errorChart.data.datasets[0].data = Object.values(currentErrorAnalysisData);
      errorChart.update();
    }
  }

  // Function to handle error type selection
  function selectErrorType(errorType: string) {
    if (selectedErrorType === errorType) {
      selectedErrorType = null;
      detailedErrorJobs = [];
    } else {
      selectedErrorType = errorType;
      detailedErrorJobs = getErrorClusterDetails(tier, timeRange, errorType);
    }
  }

  // Initialize the chart on component mount
  onMount(() => {
    const ctx = document.getElementById('errorChart') as HTMLCanvasElement;
    errorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(currentErrorAnalysisData),
        datasets: [{
          label: 'Error Count',
          data: Object.values(currentErrorAnalysisData),
          backgroundColor: '#F44336'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const errorType = Object.keys(currentErrorAnalysisData)[index];
            selectErrorType(errorType);
          }
        }
      }
    });
  });

  // Function to navigate back to the dashboard
  function navigateToDashboard() {
    goto('/');
  }

  // Function to format date strings
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
</script>

<svelte:head>
  <title>Error Analysis - Data Warehouse Jobs Monitoring</title>
</svelte:head>

<main>
  <header>
    <h1>Error Analysis</h1>
    <button class="back-button" on:click={navigateToDashboard}>Back to Dashboard</button>
  </header>

  <!-- Filter section for tier and time range -->
  <div class="filters">
    <div class="tier-filter">
      <button class:active={tier === 'tier2'} on:click={() => handleTierChange('tier2')}>Tier 2</button>
      <button class:active={tier === 'tier3'} on:click={() => handleTierChange('tier3')}>Tier 3</button>
    </div>
    <div class="time-filter">
      <button class:active={timeRange === 'today'} on:click={() => handleTimeRangeChange('today')}>Today</button>
      <button class:active={timeRange === 'week'} on:click={() => handleTimeRangeChange('week')}>Last 7 Days</button>
      <button class:active={timeRange === 'month'} on:click={() => handleTimeRangeChange('month')}>Last 30 Days</button>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="main-content">
      <!-- Chart container -->
      <div class="chart-container">
        <canvas id="errorChart"></canvas>
      </div>

      <!-- Detailed job information for selected error type -->
      {#if selectedErrorType && detailedErrorJobs.length > 0}
        <div class="job-details">
          <h2>Jobs with {selectedErrorType} Error</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Job Name</th>
                  <th>Cluster</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Records Processed</th>
                  <th>Failed Step</th>
                  <th>Affected Records</th>
                </tr>
              </thead>
              <tbody>
                {#each detailedErrorJobs as job}
                  <tr>
                    <td>{job.id}</td>
                    <td>{job.name}</td>
                    <td>{job.cluster}</td>
                    <td>{formatDate(job.startTime)}</td>
                    <td>{job.duration}</td>
                    <td>{job.recordsProcessed.toLocaleString()}</td>
                    <td>{job.errorDetails.failedStep}</td>
                    <td>{job.errorDetails.affectedRecords.toLocaleString()}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>

    <!-- Sidebar with error type list -->
    <div class="error-clusters">
      <h2>Error Types</h2>
      <ul role="listbox" aria-label="Error types">
        {#each Object.entries(currentErrorAnalysisData) as [errorType, count]}
          <li>
            <button
              role="option"
              aria-selected={selectedErrorType === errorType}
              on:click={() => selectErrorType(errorType)}
            >
              <span class="error-type">{errorType}</span>
              <span class="error-count">{count}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>

<style>
  /* Styles for the main container */
  main {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }

  /* Styles for the header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }

  h1, h2 {
    color: #333;
    margin: 0.5em 0;
  }

  /* Styles for the back button */
  .back-button {
    padding: 10px 15px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  /* Styles for filter section */
  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .tier-filter, .time-filter {
    display: flex;
    gap: 10px;
  }

  .tier-filter button, .time-filter button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .tier-filter button.active, .time-filter button.active {
    background-color: #4CAF50;
    color: white;
  }

  /* Styles for content layout */
  .content-wrapper {
    display: flex;
    gap: 20px;
  }

  .main-content {
    flex: 1;
  }

  /* Styles for chart container */
  .chart-container {
    height: 400px;
    margin-bottom: 20px;
  }

  /* Styles for job details section */
  .job-details {
    margin-top: 20px;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  /* Styles for error clusters sidebar */
  .error-clusters {
    width: 250px;
  }

  .error-clusters ul {
    list-style-type: none;
    padding: 0;
  }

  .error-clusters button {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .error-clusters button[aria-selected="true"] {
    background-color: #e3f2fd;
    font-weight: bold;
  }

  .error-clusters button:hover {
    background-color: #f5f5f5;
  }

  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .content-wrapper {
      flex-direction: column;
    }

    .error-clusters {
      width: 100%;
    }
  }
</style>