<script lang="ts">
  import { page } from '$app/stores';
  import { jobDetails } from '$lib/dummyData';
  import { format, sub, isAfter } from 'date-fns';
  import { onMount } from 'svelte';
  import { Chart, type ChartData, type ChartConfiguration } from 'chart.js/auto';
  import { goto } from '$app/navigation';

  // Define the Job type
  type Job = {
    id: string;
    name: string;
    description: string;
    status: string;
    startTime: string;
    endTime: string;
    duration: string;
    recordsProcessed: number;
    errorMessage: string;
    sourceSystem: string;
    targetSystem: string;
    steps: Array<{
      name: string;
      status: string;
      startTime: string;
      endTime: string;
      duration: string;
      recordsProcessed: number;
    }>;
    errorAnalysis: {
      [key: string]: number;
    };
    logs: Array<{
      timestamp: string;
      level: string;
      component: string;
      message: string;
    }>;
  };

  $: jobId = $page.params.id;
  $: job = jobDetails[jobId] as Job;

  let timeRange: 'all' | 'last24h' | 'last7d' = 'all';
  $: filteredLogs = filterLogs(job?.logs || [], timeRange);
  $: filteredErrorAnalysis = filterErrorAnalysis(job?.errorAnalysis || {}, timeRange);

  let errorChart: Chart | null = null;

  function filterLogs(logs: Job['logs'], range: 'all' | 'last24h' | 'last7d') {
    if (range === 'all') return logs;
    
    const now = new Date();
    const startDate = range === 'last24h' ? sub(now, { hours: 24 }) : sub(now, { days: 7 });
    return logs.filter(log => isAfter(new Date(log.timestamp), startDate));
  }

  function filterErrorAnalysis(errorAnalysis: Job['errorAnalysis'], range: 'all' | 'last24h' | 'last7d') {
    if (range === 'all') return errorAnalysis;
    
    const factor = range === 'last24h' ? 0.2 : 0.5;
    return Object.fromEntries(
      Object.entries(errorAnalysis).map(([key, value]) => [key, Math.round(value * factor)])
    );
  }

  function handleTimeRangeChange(range: 'all' | 'last24h' | 'last7d') {
    timeRange = range;
  }

  function updateErrorChart() {
    if (errorChart) {
      const chartData: ChartData = {
        labels: Object.keys(filteredErrorAnalysis),
        datasets: [{
          label: 'Error Count',
          data: Object.values(filteredErrorAnalysis),
          backgroundColor: '#F44336'
        }]
      };
      errorChart.data = chartData;
      errorChart.update();
    }
  }

  onMount(() => {
    const errorChartCtx = document.getElementById('errorAnalysisChart') as HTMLCanvasElement | null;
    if (errorChartCtx) {
      const errorAnalysisConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: Object.keys(filteredErrorAnalysis),
          datasets: [{
            label: 'Error Count',
            data: Object.values(filteredErrorAnalysis),
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
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Error Analysis'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed.y;
                  const dataset = context.dataset;
                  const total = (dataset.data as number[]).reduce((acc, data) => acc + (data as number), 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      };
      errorChart = new Chart(errorChartCtx, errorAnalysisConfig);
    }
  });

  $: {
    if (filteredErrorAnalysis) {
      updateErrorChart();
    }
  }

  function formatDate(dateString: string): string {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  }

  function getLogLevelClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return '';
    }
  }

  function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'failed': return 'failed';
      case 'in progress': return 'in-progress';
      default: return '';
    }
  }

  function navigateToDashboard() {
    goto('/');
  }

</script>

<svelte:head>
  <title>Job Details - {job?.name || 'Not Found'}</title>
</svelte:head>

<main>
  <header>
    <h1>Job Details: {job?.name || 'Not Found'}</h1>
    <button class="back-button" on:click={navigateToDashboard}>Back to Dashboard</button>
  </header>

  {#if !job}
    <p>Job not found or no details available.</p>
  {:else}
    <div class="job-info">
      <h2>Job Information</h2>
      <div class="table-container">
        <table>
          <tr>
            <th>Job ID:</th>
            <td>{job.id}</td>
          </tr>
          <tr>
            <th>Description:</th>
            <td>{job.description}</td>
          </tr>
          <tr>
            <th>Status:</th>
            <td class={getStatusClass(job.status)}>{job.status}</td>
          </tr>
          <tr>
            <th>Start Time:</th>
            <td>{formatDate(job.startTime)}</td>
          </tr>
          <tr>
            <th>End Time:</th>
            <td>{formatDate(job.endTime)}</td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>{job.duration}</td>
          </tr>
          <tr>
            <th>Records Processed:</th>
            <td>{job.recordsProcessed.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Error Message:</th>
            <td>{job.errorMessage}</td>
          </tr>
          <tr>
            <th>Source System:</th>
            <td>{job.sourceSystem}</td>
          </tr>
          <tr>
            <th>Target System:</th>
            <td>{job.targetSystem}</td>
          </tr>
        </table>
      </div>
    </div>

    {#if job.steps && job.steps.length > 0}
      <div class="job-steps">
        <h2>Job Load</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Records Processed</th>
              </tr>
            </thead>
            <tbody>
              {#each job.steps as step}
                <tr>
                  <td data-label="Table Name">{step.name}</td>
                  <td data-label="Status" class={getStatusClass(step.status)}>{step.status}</td>
                  <td data-label="Start Time">{step.startTime !== '-' ? formatDate(step.startTime) : '-'}</td>
                  <td data-label="Duration">{step.duration}</td>
                  <td data-label="Records Processed">{step.recordsProcessed.toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <!-- <div class="error-analysis">
      <h2>Error Analysis</h2>
      <div class="time-filter">
        <span>Time Range:</span>
        <button class:active={timeRange === 'all'} on:click={() => handleTimeRangeChange('all')}>All</button>
        <button class:active={timeRange === 'last24h'} on:click={() => handleTimeRangeChange('last24h')}>Last 24 Hours</button>
        <button class:active={timeRange === 'last7d'} on:click={() => handleTimeRangeChange('last7d')}>Last 7 Days</button>
      </div>
      <div class="chart-container">
        <canvas id="errorAnalysisChart"></canvas>
      </div>
    </div> -->

    <div class="job-logs">
      <h2>Job Logs</h2>
      {#if filteredLogs.length > 0}
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Component</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredLogs as log}
                <tr>
                  <td data-label="Timestamp">{formatDate(log.timestamp)}</td>
                  <td data-label="Level" class={getLogLevelClass(log.level)}>{log.level}</td>
                  <td data-label="Component">{log.component}</td>
                  <td data-label="Message">{log.message}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p>No logs available for the selected time range.</p>
      {/if}
    </div>
  {/if}
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
    gap: 10px;
  }

  h1 {
    margin: 0;
    font-size: 1.5em;
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

  h2 {
    margin-top: 30px;
    font-size: 1.2em;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  .completed { color: #4CAF50; }
  .failed { color: #F44336; }
  .in-progress { color: #2196F3; }

  .info { color: #2196F3; }
  .warning { color: #FFC107; }
  .error { color: #F44336; }

  .error-analysis {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    height: 500px; /* Adjust this value as needed */
  }

  .chart-container {
    flex-grow: 1;
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  } */

  .time-filter {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  /* .time-filter button {
    padding: 5px 10px;
    border: none;
    background-color: #ddd;
    cursor: pointer;
  }

  .time-filter button.active {
    background-color: #4CAF50;
    color: white;
  } */
  p {
    color: #666;
    font-style: italic;
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: flex-start;
    }

    .back-button {
      margin-top: 10px;
    }

    .error-analysis {
      height: 400px; /* Adjust for smaller screens */
    }
    table, thead, tbody, th, td, tr {
      display: block;
    }

    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      margin-bottom: 10px;
    }

    td {
      border: none;
      position: relative;
      padding-left: 50%;
    }

    td:before {
      content: attr(data-label);
      position: absolute;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      font-weight: bold;
    }

    .time-filter {
      flex-direction: column;
      align-items: flex-start;
    }

    /* .time-filter button {
      width: 100%;
    } */
  }
</style>