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

    {#if job.steps && job.steps.length > 0}
      <div class="job-steps">
        <h2>Job Steps</h2>
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
                <td>{step.name}</td>
                <td class={getStatusClass(step.status)}>{step.status}</td>
                <td>{step.startTime !== '-' ? formatDate(step.startTime) : '-'}</td>
                <td>{step.duration}</td>
                <td>{step.recordsProcessed.toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
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
      <canvas id="errorAnalysisChart"></canvas>
    </div> -->

    <div class="job-logs">
      <h2>Job Logs</h2>
      {#if filteredLogs.length > 0}
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
                <td>{formatDate(log.timestamp)}</td>
                <td class={getLogLevelClass(log.level)}>{log.level}</td>
                <td>{log.component}</td>
                <td>{log.message}</td>
              </tr>
            {/each}
          </tbody>
        </table>
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
  }

  canvas {
    max-height: 300px;
    width: 100%;
  }

  .time-filter {
    margin-bottom: 10px;
  }

  .time-filter button {
    margin-left: 10px;
    padding: 5px 10px;
    border: none;
    background-color: #ddd;
    cursor: pointer;
  }

  .time-filter button.active {
    background-color: #4CAF50;
    color: white;
  }

  p {
    color: #666;
    font-style: italic;
  }
</style>