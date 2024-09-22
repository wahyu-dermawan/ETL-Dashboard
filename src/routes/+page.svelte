<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { jobData, jobStatusData, recentJobs } from '$lib/dummyData';
  import { goto } from '$app/navigation';

  // Register Chart.js components
  Chart.register(...registerables);

  // Define types
  type TimeRange = 'today' | 'week' | 'month';
  type Tier = 'tier2' | 'tier3';

  // Initialize state variables
  let timeRange: TimeRange = 'week';
  let tier: Tier = 'tier2';
  let selectedCluster: string | null = null;
  let jobStatusChart: Chart | null = null;

  // Define clusters
  const tier2Clusters = [
    'Tax Return Processing (TRP)', 'Extensification', 'Taxpayer Service (TPS)',
    'Audit', 'Criminal Investigation', 'Objection and Appeal', 'Non-Objection',
    'Registration', 'Payment', 'Compliance Risk Management (CRM)',
    'Document Management System (DMS)', 'Third Party Data Processing (TPD)',
    'Taxpayer Account Management (TAM)', 'Valuation', 'Exchange of Information (EoI)',
    'Collection', 'Tax Supervisory', 'Operational Intelligence'
  ];

  const tier3Clusters = [
    'Functional Requirement-Detail Design', 'Exemination Worksheet'
  ];

  // Reactive declarations
  $: clusters = tier === 'tier2' ? tier2Clusters : tier3Clusters;

  // Calculate current job data based on filters
  $: currentJobData = selectedCluster 
    ? jobData[tier][timeRange][selectedCluster]
    : Object.values(jobData[tier][timeRange]).reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
          acc[key] = (acc[key] || 0) + curr[key];
        });
        return acc;
      }, {} as any);

  // Calculate current job status data based on filters
  $: currentJobStatusData = selectedCluster 
    ? jobStatusData[tier][timeRange][selectedCluster]
    : Object.values(jobStatusData[tier][timeRange]).reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
          acc[key] = (acc[key] || 0) + curr[key];
        });
        return acc;
      }, {} as any);

  // Get recent jobs based on current filters
  $: currentRecentJobs = recentJobs[tier][timeRange];

  // Reactive statement to update chart when data changes
  $: if (jobStatusChart) {
    updateChart(currentJobStatusData);
  }

  // Function to update the chart
  function updateChart(data: Record<string, number>) {
    if (jobStatusChart) {
      jobStatusChart.data.labels = Object.keys(data);
      jobStatusChart.data.datasets[0].data = Object.values(data);
      jobStatusChart.update();
    }
  }

  // Event handlers for filter changes
  function handleTimeRangeChange(range: TimeRange): void {
    timeRange = range;
  }

  function handleTierChange(newTier: Tier): void {
    tier = newTier;
    selectedCluster = null;
  }

  function handleClusterChange(cluster: string | null): void {
    selectedCluster = cluster === '' ? null : cluster;
  }

  // Initialize chart on component mount
  onMount(() => {
    const jobStatusCtx = document.getElementById('jobStatusChart') as HTMLCanvasElement | null;
    if (jobStatusCtx) {
      jobStatusChart = new Chart(jobStatusCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(currentJobStatusData),
          datasets: [{
            data: Object.values(currentJobStatusData),
            backgroundColor: ['#9C27B0', '#2196F3', '#4CAF50', '#F44336', '#FF9800']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.formattedValue;
                  const total = context.dataset.data.reduce((acc: number, current: number) => acc + current, 0);
                  const percentage = ((context.parsed as number / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  });

  // Update chart after any reactive updates
  afterUpdate(() => {
    if (jobStatusChart) {
      updateChart(currentJobStatusData);
    }
  });

  // Helper functions
  function getTimeRangeText(range: TimeRange): string {
    switch (range) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      default: return '';
    }
  }

  function calculateErrorRate(jobData: { activeJobs: number; runningJobs: number; completedJobs: number; failedJobs: number; notRunningJobs: number; }) {
    const totalJobs = jobData.completedJobs + jobData.failedJobs;
    return totalJobs > 0 ? ((jobData.failedJobs / totalJobs) * 100).toFixed(1) : '0.0';
  }

  // Navigation functions
  function navigateToErrorAnalysis() {
    goto('/error-analysis');
  }

  function navigateToJobDetails(jobId: string) {
    goto(`/job/${jobId}`);
  }
</script>

<svelte:head>
  <title>Data Warehouse Jobs Monitoring</title>
</svelte:head>

<main>
  <header>
    <h1>Data Warehouse Jobs Monitoring</h1>
  </header>

  <div class="filters">
    <div class="tier-filter">
      <button class:active={tier === 'tier2'} on:click={() => handleTierChange('tier2')}>Tier 2</button>
      <button class:active={tier === 'tier3'} on:click={() => handleTierChange('tier3')}>Tier 3</button>
    </div>
    <div class="cluster-filter">
      <select on:change={(e) => handleClusterChange(e.target.value)}>
        <option value="">All Clusters</option>
        {#each clusters as cluster}
          <option value={cluster}>{cluster}</option>
        {/each}
      </select>
    </div>
    <div class="time-filter">
      <button class:active={timeRange === 'today'} on:click={() => handleTimeRangeChange('today')}>Today</button>
      <button class:active={timeRange === 'week'} on:click={() => handleTimeRangeChange('week')}>Last 7 Days</button>
      <button class:active={timeRange === 'month'} on:click={() => handleTimeRangeChange('month')}>Last 30 Days</button>
    </div>
  </div>

  <div class="status-cards">
    <div class="card active">
      <h2>Active Jobs</h2>
      <p>{currentJobData.activeJobs}</p>
    </div>
    <div class="card running">
      <h2>Running Jobs</h2>
      <p>{currentJobData.runningJobs}</p>
    </div>
    <div class="card completed">
      <h2>Completed {getTimeRangeText(timeRange)}</h2>
      <p>{currentJobData.completedJobs}</p>
    </div>
    <button class="card failed" on:click={navigateToErrorAnalysis}>
      <h2>Failed {getTimeRangeText(timeRange)}</h2>
      <p class="job-count">{currentJobData.failedJobs}</p>
      <div class="error-rate">
        <span>Error Rate:</span>
        <span>{calculateErrorRate(currentJobData)}%</span>
      </div>
    </button>
    <div class="card not-running">
      <h2>Not Run</h2>
      <p>{currentJobData.notRunningJobs}</p>
    </div>
  </div>

  <div class="dashboard-container">
    <div class="chart-section">
      <h2>Job Status Overview</h2>
      <div class="chart-wrapper">
        <canvas id="jobStatusChart"></canvas>
      </div>
    </div>
    <div class="recent-jobs-section">
      <h2>Recent Jobs</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Name</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>PIC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each currentRecentJobs as job}
              <tr>
                <td>{job.id}</td>
                <td>{job.name}</td>
                <td class={job.status.toLowerCase()}>{job.status}</td>
                <td>{new Date(job.startTime).toLocaleString()}</td>
                <td>{job.duration}</td>
                <td>{job.pic}</td>
                <td><button on:click={() => navigateToJobDetails(job.id)}>View</button></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
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
    margin-bottom: 20px;
  }

  h1 {
    color: #333;
    text-align: center;
  }

  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .tier-filter, .time-filter {
    display: flex;
    gap: 10px;
  }

  .cluster-filter {
    flex-grow: 1;
    margin: 0 10px;
  }

  .tier-filter button, .time-filter button {
    padding: 10px 15px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
  }

  .tier-filter button {
    background-color: #e0e0e0;
    color: #333;
  }

  .tier-filter button.active {
    background-color: #2196F3;
    color: white;
  }

  .time-filter button {
    background-color: #f0f0f0;
    color: #333;
  }

  .time-filter button.active {
    background-color: #4CAF50;
    color: white;
  }

  .cluster-filter select {
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background-color: white;
    font-size: 14px;
  }

  .status-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .card {
    padding: 20px;
    border-radius: 10px;
    color: white;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .card.active { background-color: #9C27B0; }
  .card.running { background-color: #2196F3; }
  .card.completed { background-color: #4CAF50; }
  .card.failed { background-color: #F44336; }
  .card.not-running { background-color: #FF9800; }

  .card h2 {
    margin: 0;
    font-size: 1.2em;
  }

  .card p {
    font-size: 2em;
    margin: 10px 0 0;
  }

  .dashboard-container {
    display: flex;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .chart-section, .recent-jobs-section {
    flex: 1;
    padding: 20px;
  }

  .chart-wrapper {
    height: 300px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  td.completed { color: #4CAF50; }
  td.failed { color: #F44336; }
  td.running { color: #2196F3; }
  td.not-running { color: #FF9800; }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .tier-filter, .time-filter, .cluster-filter {
      margin-bottom: 10px;
    }

    .status-cards {
      grid-template-columns: 1fr;
    }

    .dashboard-container {
      flex-direction: column;
    }

    .chart-section, .recent-jobs-section {
      width: 100%;
    }
  }
</style>