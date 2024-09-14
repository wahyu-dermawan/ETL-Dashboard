<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { errorAnalysisData, errorClusteredJobs } from '$lib/dummyData';
  import { goto } from '$app/navigation';

  type TimeRange = 'today' | 'week' | 'month';
  type ErrorType = keyof typeof errorAnalysisData['today'];

  let timeRange: TimeRange = 'week';
  let errorChart: Chart | null = null;
  let selectedErrorType: ErrorType | null = null;

  $: currentErrorAnalysisData = errorAnalysisData[timeRange];
  $: currentErrorClusteredJobs = errorClusteredJobs[timeRange];

  function handleTimeRangeChange(range: TimeRange) {
    timeRange = range;
    selectedErrorType = null;
    updateChart();
  }

  function updateChart() {
    if (errorChart) {
      errorChart.data.labels = Object.keys(currentErrorAnalysisData);
      errorChart.data.datasets[0].data = Object.values(currentErrorAnalysisData);
      errorChart.update();
    }
  }

  function selectErrorType(errorType: string) {
    selectedErrorType = selectedErrorType === errorType ? null : errorType as ErrorType;
  }

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

  function navigateToDashboard() {
    goto('/');
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

  <div class="time-filter">
    <button class:active={timeRange === 'today'} on:click={() => handleTimeRangeChange('today')}>Today</button>
    <button class:active={timeRange === 'week'} on:click={() => handleTimeRangeChange('week')}>Last 7 Days</button>
    <button class:active={timeRange === 'month'} on:click={() => handleTimeRangeChange('month')}>Last 30 Days</button>
  </div>

  <div class="content-wrapper">
    <div class="main-content">
      <div class="chart-container">
        <canvas id="errorChart"></canvas>
      </div>

      {#if selectedErrorType}
        <div class="job-details">
          <h2>Jobs with {selectedErrorType} Error</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Job Name</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {#each currentErrorClusteredJobs[selectedErrorType] as job}
                  <tr>
                    <td data-label="Job ID">{job.id}</td>
                    <td data-label="Job Name">{job.name}</td>
                    <td data-label="Start Time">{job.startTime}</td>
                    <td data-label="Duration">{job.duration}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>

    <div class="error-clusters">
      <h2>Error Clusters</h2>
      <ul role="listbox" aria-label="Error types">
        {#each Object.entries(currentErrorAnalysisData) as [errorType, count]}
          <li>
            <button
              role="option"
              aria-selected={selectedErrorType === errorType}
              on:click={() => selectErrorType(errorType)}
              on:keydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectErrorType(errorType);
                }
              }}
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
  main {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  h1, h2 {
    color: #333;
    margin: 0.5em 0;
  }

  .back-button {
    padding: 10px 15px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .back-button:hover {
    background-color: #1976D2;
  }

  .time-filter {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .time-filter button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex-grow: 1;
  }

  .time-filter button.active {
    background-color: #4CAF50;
    color: white;
  }

  .content-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .main-content {
    flex: 1 1 600px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .chart-container {
    height: 400px;
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .job-details {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .error-clusters {
    flex: 1 1 300px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .error-clusters ul {
    list-style-type: none;
    padding: 0;
  }

  .error-clusters li {
    margin-bottom: 0.5rem;
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

  .error-clusters button:hover, .error-clusters button:focus {
    background-color: #e9e9e9;
  }

  .error-type {
    flex-grow: 1;
  }

  .error-count {
    margin-left: 1rem;
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

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    .time-filter {
      flex-direction: column;
    }

    .time-filter button {
      width: 100%;
    }

    table {
      border: 0;
    }

    table thead {
      display: none;
    }

    table tr {
      margin-bottom: 10px;
      display: block;
      border-bottom: 2px solid #ddd;
    }

    table td {
      display: block;
      text-align: right;
      padding-left: 50%;
      position: relative;
    }

    table td::before {
      content: attr(data-label);
      position: absolute;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      text-align: left;
      font-weight: bold;
    }
  }
</style>