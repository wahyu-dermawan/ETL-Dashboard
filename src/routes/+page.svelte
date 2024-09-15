<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import type { ChartConfiguration, ChartType } from 'chart.js';
  import { jobData, jobStatusData, errorAnalysisData, recentJobs } from '$lib/dummyData';
  import { goto } from '$app/navigation';

  type TimeRange = 'today' | 'week' | 'month';

interface Job {
  id: string;
  name: string;
  status: string;
  startTime: string;
  duration: string;
  recordsProcessed: number;
  errorMessage: string;
}

interface RecentJobs {
  today: Job[];
  week: Job[];
  month: Job[];
}

let timeRange: TimeRange = 'week';
let jobStatusChart: Chart | null = null;

$: currentJobData = jobData[timeRange];
$: currentJobStatusData = jobStatusData[timeRange];
$: currentRecentJobs = (recentJobs as RecentJobs)[timeRange];



  let showMobileMenu = false;
  let activeTab: 'chart' | 'table' = 'chart';



  $: if (jobStatusChart) {
    updateCharts();
  }

  function handleTimeRangeChange(range: 'today' | 'week' | 'month'): void {
    timeRange = range;
    updateCharts();
    showMobileMenu = false;
  }

  function createChart(ctx: CanvasRenderingContext2D | null, config: ChartConfiguration): Chart | null {
    if (ctx) {
      return new Chart(ctx, config);
    }
    return null;
  }

  function updateCharts() {
    if (jobStatusChart) {
      jobStatusChart.data.labels = Object.keys(currentJobStatusData);
      jobStatusChart.data.datasets[0].data = Object.values(currentJobStatusData);
      jobStatusChart.update();
    }
  }

  onMount(() => {
    const jobStatusCtx = document.getElementById('jobStatusChart') as HTMLCanvasElement | null;
    if (jobStatusCtx) {
      const jobStatusConfig: ChartConfiguration<ChartType, number[], string> = {
        type: 'pie',
        data: {
          labels: Object.keys(currentJobStatusData),
          datasets: [{
            data: Object.values(currentJobStatusData),
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      };
      jobStatusChart = createChart(jobStatusCtx.getContext('2d'), jobStatusConfig);
    }
  });

  function getTimeRangeText(range: 'today' | 'week' | 'month'): string {
    switch (range) {
      case 'today':
        return 'Today';
      case 'week':
        return 'Last Week';
      case 'month':
        return 'This Month';
      default:
        return '';
    }
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }

  function setActiveTab(tab: 'chart' | 'table') {
    activeTab = tab;
  }

  function calculateErrorRate(jobData) {
    const totalJobs = jobData.completedJobs + jobData.failedJobs;
    return totalJobs > 0 ? ((jobData.failedJobs / totalJobs) * 100).toFixed(1) : '0.0';
  }

  function navigateToErrorAnalysis(){
    goto('/error-analysis')
  }

</script>

<svelte:head>
  <title>Data Warehouse Jobs Monitoring</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>

<main>
  <header>
    <h1>Data Warehouse Jobs Monitoring</h1>
    <button class="mobile-menu-toggle" on:click={toggleMobileMenu}>
      ☰
    </button>
    <div class="time-filter" class:show-mobile-menu={showMobileMenu}>
      <button class:active={timeRange === 'today'} on:click={() => handleTimeRangeChange('today')}>Today</button>
      <button class:active={timeRange === 'week'} on:click={() => handleTimeRangeChange('week')}>Last 7 Days</button>
      <button class:active={timeRange === 'month'} on:click={() => handleTimeRangeChange('month')}>Last 30 Days</button>
    </div>
  </header>

  <div class="status-cards">
    <div class="card active">
      <h2>Active Jobs</h2>
      <p>{currentJobData.activeJobs}</p>
    </div>
    <div class="card completed">
      <h2>Completed {getTimeRangeText(timeRange)}</h2>
      <p>{currentJobData.completedJobs}</p>
    </div>
    <button class="card failed" on:click={navigateToErrorAnalysis} type="button">
      <div class="card-content">
        <h2>Failed {getTimeRangeText(timeRange)}</h2>
        <p class="job-count">{currentJobData.failedJobs}</p>
        <div class="error-rate">
          <span class="label">Error Rate:</span>
          <span class="value">{calculateErrorRate(currentJobData)}%</span>
        </div>
      </div>
      <!-- <span class="view-analysis">View Error Analysis</span> -->
    </button>
    <div class="card pending">
      <h2>Pending {getTimeRangeText(timeRange)}</h2>
      <p>{currentJobData.pendingJobs}</p>
    </div>
  </div>

  <div class="mobile-tabs">
    <button class:active={activeTab === 'chart'} on:click={() => setActiveTab('chart')}>Chart</button>
    <button class:active={activeTab === 'table'} on:click={() => setActiveTab('table')}>Recent Jobs</button>
  </div>

  <div class="dashboard-container">
    <div class="chart-section" class:active={activeTab === 'chart'}>
      <h2>Job Status Overview</h2>
      <div class="chart-wrapper">
        <canvas id="jobStatusChart"></canvas>
      </div>
    </div>
    <div class="section-divider"></div>
    <div class="recent-jobs-section" class:active={activeTab === 'table'}>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each currentRecentJobs as job}
              <tr>
                <td>{job.id}</td>
                <td>{job.name}</td>
                <td class={job.status.toLowerCase()}>{job.status}</td>
                <td>{job.startTime}</td>
                <td>{job.duration}</td>
                <td><a href="/job/{job.id}">View</a></td>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .mobile-menu-toggle {
    display: none;
  }

  .back-button:hover {
    background-color: #1976D2;
  }

  .time-filter {
  margin-bottom: 20px;
  }

.time-filter button {
  margin-right: 10px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.time-filter button.active {
  background-color: #4CAF50;
  color: white;
}

  .status-cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .card {
    width: 23%;
    padding: 3px;
    border-radius: 5px;
    color: white;
    text-align: center;
    margin-bottom: 10px;
  }

  .card.active { background-color: #2196F3; }
  .card.completed { background-color: #4CAF50; }
  .card.failed { background-color: #F44336; }
  .card.pending { background-color: #FFC107; }

  .mobile-tabs {
    display: none;
  }

  .dashboard-container {
    display: flex;
    gap: 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    position: relative;
  }

  .chart-section, .recent-jobs-section {
    flex: 1;
    min-width: 0;
  }

  .section-divider {
    width: 1px;
    background-color: #ddd;
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .chart-wrapper {
    height: 300px;
    width: 100%;
  }

  .table-wrapper {
    overflow-x: auto;
    max-height: 300px;
    overflow-y: auto;
  }

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
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td.completed { color: #4CAF50; }
  td.failed { color: #F44336; }
  td.in-progress { color: #2196F3; }

  td a {
    color: #2196F3;
    text-decoration: none;
  }

  td a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: block;
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
    }

    .time-filter {
      display: none;
      width: 100%;
      margin-top: 10px;
    }

    .time-filter.show-mobile-menu {
      display: flex;
      flex-direction: column;
    }

    .time-filter button {
      margin: 5px 0;
    }

    .card {
      width: 48%;
    }

    .mobile-tabs {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }

    .mobile-tabs button {
      padding: 10px;
      background-color: #ddd;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .mobile-tabs button.active {
      background-color: #4CAF50;
      color: white;
    }

    .dashboard-container {
      flex-direction: column;
    }

    .chart-section, .recent-jobs-section {
      display: none;
    }

    .chart-section.active, .recent-jobs-section.active {
      display: block;
    }

    .section-divider {
      width: auto;
      height: 1px;
      left: 20px;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .card.failed {
  background-color: #F44336;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card.failed:hover {
  background-color: #D32F2F;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card.failed h2 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.card.failed .job-count {
  font-size: 2.5em;
  font-weight: bold;
  margin: 10px 0;
}

.card.failed .error-rate {
  font-size: 0.9em;
  margin-top: 5px;
}

.card.failed .error-rate .label {
  font-weight: bold;
}


.card.failed::after {
  content: '→';
  position: absolute;
  bottom: 10px;
  right: -20px;
  font-size: 1.5em;
  transition: right 0.3s ease;
}

.card.failed:hover::after {
  right: 10px;
}
</style>