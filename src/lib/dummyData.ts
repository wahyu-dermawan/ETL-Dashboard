import { sub, addDays, addMinutes, startOfWeek, startOfMonth, startOfQuarter, format } from 'date-fns';

// Current date and time
const now = new Date();

// ==================== Constants ====================

// List of Tier 2 clusters
const tier2Clusters = [
  'Tax Return Processing (TRP)', 'Extensification', 'Taxpayer Service (TPS)',
  'Audit', 'Criminal Investigation', 'Objection and Appeal', 'Non-Objection',
  'Registration', 'Payment', 'Compliance Risk Management (CRM)',
  'Document Management System (DMS)', 'Third Party Data Processing (TPD)',
  'Taxpayer Account Management (TAM)', 'Valuation', 'Exchange of Information (EoI)',
  'Collection', 'Tax Supervisory', 'Operational Intelligence'
];

// List of Tier 3 clusters
const tier3Clusters = [
  'Functional Requirement-Detail Design', 'Exemination Worksheet'
];

// Combine all clusters
const allClusters = [...tier2Clusters, ...tier3Clusters];

// List of possible error types
const errorTypes = [
  'Connection Timeout', 'Data Validation Error', 'Transformation Error',
  'Source Data Unavailable', 'Insufficient Resources'
];

// List of possible Person In Charge (PIC) names
const pics = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Davis'];

// ==================== Interfaces ====================

// Interface for a single step in a job
interface JobStep {
  name: string;
  status: string;
  startTime: string;
  endTime: string | null;
  duration: string;
  recordsProcessed: number;
}

// interface for daily data point
interface DailyDataPoint {
  date: Date;
  recordsProcessed: number;
  duration: number;
  throughput: number;
  isInitialLoad: boolean;
  dataType: 'dimension' | 'fact';
}

// Aggregate data point
interface AggregatedDataPoint {
  period: string;
  recordsProcessed: number;
  duration: number;
  averageThroughput: number;
}

// Interface for a single data point in a job load

interface PeriodicDataPoint{
  period: string;
  rowCount: number;
  duration: number;
  throughput: number;
}

// Interface for a job load
interface JobLoad {
  loadRunId: string;
  loadId: string;
  targetTable: string;
  status: string;
  outputRowCount: number;
  startTime: string;
  duration: string;
  dailyData: DailyDataPoint[];
}

// Interface for a complete job
interface Job {
  id: string;
  name: string;
  description: string;
  tier: 'Tier 2' | 'Tier 3';
  cluster: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  pic: string;
  recordsProcessed: number;
  errorMessage: string;
  sourceSystem: string;
  targetSystem: string;
  steps: JobStep[];
  errorAnalysis: Record<string, number>;
  logs: Array<{
    timestamp: string;
    level: string;
    component: string;
    message: string;
  }>;
  jobLoads: JobLoad[];
}

// Interface for cluster data
interface ClusterData {
  activeJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  notRunningJobs: number;
}

// Interface for time range data
interface TimeRangeData {
  [cluster: string]: ClusterData;
}

// Interface for tier data
interface TierData {
  today: TimeRangeData;
  week: TimeRangeData;
  month: TimeRangeData;
}

// Interface for job data
interface JobData {
  tier2: TierData;
  tier3: TierData;
}

// ==================== Helper Functions ====================

/**
 * Generates a unique job ID
 * @returns A string representing a unique job ID
 */
function generateJobId(): string {
  return `JOB${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

/**
 * Generates periodic data points for a job load
 * @param startDate The start date of the job load
 * @param endDate The end date of the job load
 * @param totalRows The total number of rows processed
 * @param periodType 'week' | 'month' | 'quarter'
 * @returns An array of PeriodicDataPoint objects
 */

function generatePeriodicDataPoints(startDate: Date, endDate: Date, totalRows: number, periodType: 'week' | 'month' | 'quarter'): PeriodicDataPoint[] {
  const dataPoints: PeriodicDataPoint[] = [];
  let currentDate = startDate;
  let accumulatedRows = 0;

  while (currentDate < endDate) {
    let nextDate: Date;
    let periodLabel: string;

    if (periodType === 'week') {
      nextDate = addDays(startOfWeek(currentDate), 7);
      periodLabel = `Week ${format(currentDate, 'w')}`;
    } else if (periodType === 'month') {
      nextDate = startOfMonth(addDays(currentDate, 32));
      periodLabel = format(currentDate, 'MMM yyyy');
    } else {
      nextDate = startOfQuarter(addDays(currentDate, 92));
      periodLabel = `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`;
    }

    if (nextDate > endDate) nextDate = endDate;

    const periodDuration = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    const rowCount = Math.floor((nextDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * totalRows);
    const periodRowCount = rowCount - accumulatedRows;
    accumulatedRows = rowCount;

       // Calculate throughput as records per day
    const throughput = periodDuration > 0 ? periodRowCount / periodDuration : 0;

    dataPoints.push({
      period: periodLabel,
      rowCount: periodRowCount,
      duration: periodDuration,
      throughput: Math.round(throughput)
    });

    currentDate = nextDate;
  }

  return dataPoints;
}

//Generate Daily Data
function generateDailyData(startDate: Date, days: number): DailyDataPoint[] {
  const dailyData: DailyDataPoint[] = [];
  let currentDate = startDate;

  for (let i = 0; i < days; i++) {
    const isInitialLoad = i === 0;
    const dataType = Math.random() > 0.5 ? 'dimension' : 'fact';
    const recordsProcessed = isInitialLoad 
      ? Math.floor(Math.random() * 900000) + 100000 // 100,000 to 1,000,000 for initial load
      : Math.floor(Math.random() * 4000) + 1000; // 1,000 to 5,000 for daily updates
    const duration = isInitialLoad
      ? Math.floor(Math.random() * 180) + 60 // 60 to 240 minutes for initial load
      : Math.floor(Math.random() * 30) + 30; // 30 to 60 minutes for daily updates
    const throughput = recordsProcessed / duration;

    dailyData.push({
      date: currentDate,
      recordsProcessed,
      duration,
      throughput,
      isInitialLoad,
      dataType
    });

    currentDate = addDays(currentDate, 1);
  }

  return dailyData;
}

//Function Aggregate Data
function aggregateData(dailyData: DailyDataPoint[], periodType: 'week' | 'month'): AggregatedDataPoint[] {
  const aggregatedData: AggregatedDataPoint[] = [];
  let currentPeriodStart = startOfWeek(dailyData[0].date);
  let currentPeriodEnd = periodType === 'week' 
    ? addDays(currentPeriodStart, 7) 
    : startOfMonth(addDays(currentPeriodStart, 32));
  
  let currentPeriodData: DailyDataPoint[] = [];

  for (const day of dailyData) {
    if (day.date >= currentPeriodEnd) {
      if (currentPeriodData.length > 0) {
        const totalRecords = currentPeriodData.reduce((sum, d) => sum + d.recordsProcessed, 0);
        const totalDuration = currentPeriodData.reduce((sum, d) => sum + d.duration, 0);
        aggregatedData.push({
          period: periodType === 'week' 
            ? `Week ${format(currentPeriodStart, 'w')}` 
            : format(currentPeriodStart, 'MMM yyyy'),
          recordsProcessed: totalRecords,
          duration: totalDuration,
          averageThroughput: totalRecords / totalDuration
        });
      }
      currentPeriodStart = periodType === 'week' ? startOfWeek(day.date) : startOfMonth(day.date);
      currentPeriodEnd = periodType === 'week' 
        ? addDays(currentPeriodStart, 7) 
        : startOfMonth(addDays(currentPeriodStart, 32));
      currentPeriodData = [];
    }
    currentPeriodData.push(day);
  }

  // Add the last period if there's any data left
  if (currentPeriodData.length > 0) {
    const totalRecords = currentPeriodData.reduce((sum, d) => sum + d.recordsProcessed, 0);
    const totalDuration = currentPeriodData.reduce((sum, d) => sum + d.duration, 0);
    aggregatedData.push({
      period: periodType === 'week' 
        ? `Week ${format(currentPeriodStart, 'w')}` 
        : format(currentPeriodStart, 'MMM yyyy'),
      recordsProcessed: totalRecords,
      duration: totalDuration,
      averageThroughput: totalRecords / totalDuration
    });
  }

  return aggregatedData;
}


/**
 * Generates a single job load
 * @param startTime The start time of the job load
 * @returns A JobLoad object
 */
function generateJobLoad(startTime: Date): JobLoad {
  const durationInDays = Math.floor(Math.random() * 60) + 30; // 30 to 90 days
  const endTime = addDays(startTime, durationInDays);
  const status = Math.random() < 0.8 ? 'Completed' : 
                 Math.random() < 0.9 ? 'Failed' : 'Running';
  const dailyData = generateDailyData(startTime, durationInDays);
  const outputRowCount = dailyData.reduce((sum, day) => sum + day.recordsProcessed, 0);

  return {
    loadRunId: `LR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    loadId: `L${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    targetTable: `Table_${Math.floor(Math.random() * 10) + 1}`,
    status,
    outputRowCount,
    startTime: startTime.toISOString(),
    duration: `${durationInDays} days`,
    dailyData
  };
}

/**
 * Generates a complete job
 * @param cluster The cluster the job belongs to
 * @param startTime The start time of the job
 * @param forceTier Optional parameter to force the job to be a specific tier
 * @returns A Job object
 */
function generateJob(cluster: string, startTime: Date, forceTier?: 'Tier 2' | 'Tier 3'): Job {
  const jobId = generateJobId();
  const duration = Math.floor(Math.random() * 120) + 30; // 30 to 150 minutes
  const endTime = addMinutes(startTime, duration);
  const status = Math.random() < 0.7 ? 'Completed' : 
                 Math.random() < 0.9 ? 'Failed' : 
                 Math.random() < 0.95 ? 'Running' : 'Not Running';
  const recordsProcessed = Math.floor(Math.random() * 1000000);
  const errorType = status === 'Failed' ? errorTypes[Math.floor(Math.random() * errorTypes.length)] : null;

  const tier = forceTier || (Math.random() < 0.7 ? 'Tier 2' : 'Tier 3');
  const pic = pics[Math.floor(Math.random() * pics.length)];

  // Generate Job loads
  const jobLoads = Array(Math.floor(Math.random() * 5) + 1).fill(null).map(() => 
    generateJobLoad(addMinutes(startTime, Math.floor(Math.random() * 30)))
  );

  return {
    id: jobId,
    name: `${cluster} Job`,
    description: `This is a ${tier} job for the ${cluster} cluster.`,
    tier,
    cluster,
    status,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: `${duration} minutes`,
    pic,
    recordsProcessed,
    errorMessage: errorType ? `${errorType} occurred` : '',
    sourceSystem: 'Source Database',
    targetSystem: 'Data Warehouse',
    jobLoads,
    steps: [
      {
        name: 'Extract',
        status: 'Completed',
        startTime: startTime.toISOString(),
        endTime: addMinutes(startTime, duration / 3).toISOString(),
        duration: `${Math.floor(duration / 3)} minutes`,
        recordsProcessed: Math.floor(recordsProcessed * 0.4)
      },
      {
        name: 'Transform',
        status: status === 'Failed' && Math.random() < 0.5 ? 'Failed' : 'Completed',
        startTime: addMinutes(startTime, duration / 3).toISOString(),
        endTime: addMinutes(startTime, (duration / 3) * 2).toISOString(),
        duration: `${Math.floor(duration / 3)} minutes`,
        recordsProcessed: Math.floor(recordsProcessed * 0.3)
      },
      {
        name: 'Load',
        status: status === 'Failed' && Math.random() >= 0.5 ? 'Failed' : (status === 'Running' ? 'Running' : 'Completed'),
        startTime: addMinutes(startTime, (duration / 3) * 2).toISOString(),
        endTime: status === 'Running' ? null : endTime.toISOString(),
        duration: status === 'Running' ? 'In Progress' : `${Math.floor(duration / 3)} minutes`,
        recordsProcessed: Math.floor(recordsProcessed * 0.3)
      }
    ],
    errorAnalysis: status === 'Failed' ? {
      [errorType as string]: Math.floor(Math.random() * 10) + 1,
      ...Object.fromEntries(errorTypes.filter(et => et !== errorType).map(et => [et, 0]))
    } : Object.fromEntries(errorTypes.map(et => [et, 0])),
    logs: Array.from({ length: 10 }, (_, i) => ({
      timestamp: addMinutes(startTime, (duration / 10) * i).toISOString(),
      level: i === 9 && status === 'Failed' ? 'ERROR' : 'INFO',
      component: ['Extractor', 'Transformer', 'Loader'][Math.floor(i / 4)],
      message: i === 9 && status === 'Failed' ? `${errorType} occurred` : `Processing step ${i + 1} completed`
    }))
  };
}

/**
 * Generates a set of jobs for a given time range
 * @param startDate The start date of the time range
 * @param endDate The end date of the time range
 * @param count The number of jobs to generate
 * @returns An array of Job objects
 */
function generateJobsForTimeRange(startDate: Date, endDate: Date, count: number): Job[] {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const startTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const cluster = allClusters[Math.floor(Math.random() * allClusters.length)];
    // Ensure we generate some Tier 3 jobs
    const forceTier = i % 3 === 0 ? 'Tier 3' : undefined;
    jobs.push(generateJob(cluster, startTime, forceTier));
  }
  return jobs;
}

// ==================== Data Generation ====================

// Generate jobs for different time ranges
const todayJobs = generateJobsForTimeRange(sub(now, { hours: 24 }), now, 50);
const weekJobs = generateJobsForTimeRange(sub(now, { days: 7 }), now, 200);
const monthJobs = generateJobsForTimeRange(sub(now, { days: 30 }), now, 500);

/**
 * Aggregates job data
 * @param jobs An array of Job objects
 * @returns A JobData object containing aggregated data
 */
function aggregateJobData(jobs: Job[]): JobData {
  return jobs.reduce((acc: JobData, job) => {
    const tierKey = job.tier === 'Tier 2' ? 'tier2' : 'tier3';
    const timeKey = job.startTime > sub(now, { hours: 24 }).toISOString() ? 'today' :
                    job.startTime > sub(now, { days: 7 }).toISOString() ? 'week' : 'month';
    
    if (!acc[tierKey][timeKey][job.cluster]) {
      acc[tierKey][timeKey][job.cluster] = {
        activeJobs: 0, runningJobs: 0, completedJobs: 0, failedJobs: 0, notRunningJobs: 0
      };
    }

    const clusterData = acc[tierKey][timeKey][job.cluster];
    clusterData.activeJobs++;
    if (job.status === 'Running') clusterData.runningJobs++;
    else if (job.status === 'Completed') clusterData.completedJobs++;
    else if (job.status === 'Failed') clusterData.failedJobs++;
    else if (job.status === 'Not Running') clusterData.notRunningJobs++;

    return acc;
  }, { tier2: { today: {}, week: {}, month: {} }, tier3: { today: {}, week: {}, month: {} } });
}

// ==================== Exported Data ====================

// Aggregate job data
export const jobData: JobData = aggregateJobData([...todayJobs, ...weekJobs, ...monthJobs]);
export const jobStatusData: JobData = jobData;

// Create a record of job details
export const jobDetails: Record<string, Job> = [...todayJobs, ...weekJobs, ...monthJobs].reduce((acc, job) => {
  acc[job.id] = job;
  return acc;
}, {} as Record<string, Job>);

// Create a record of recent jobs
export const recentJobs: {
  tier2: { today: Job[], week: Job[], month: Job[] },
  tier3: { today: Job[], week: Job[], month: Job[] }
} = {
  tier2: {
    today: todayJobs.filter(job => job.tier === 'Tier 2').slice(0, 10),
    week: weekJobs.filter(job => job.tier === 'Tier 2').slice(0, 20),
    month: monthJobs.filter(job => job.tier === 'Tier 2').slice(0, 30)
  },
  tier3: {
    today: todayJobs.filter(job => job.tier === 'Tier 3').slice(0, 5),
    week: weekJobs.filter(job => job.tier === 'Tier 3').slice(0, 10),
    month: monthJobs.filter(job => job.tier == 'Tier 3'.slice(0, 15)),
  }
};


/**
 * Aggregates error analysis data from jobs
 * @param jobs An array of Job objects
 * @returns A JobData object containing aggregated error analysis data
 */
function aggregateErrorAnalysis(jobs: Job[]): JobData {
  return jobs.reduce((acc: JobData, job) => {
    const tierKey = job.tier === 'Tier 2' ? 'tier2' : 'tier3';
    const timeKey = job.startTime > sub(now, { hours: 24 }).toISOString() ? 'today' :
                    job.startTime > sub(now, { days: 7 }).toISOString() ? 'week' : 'month';
    
    if (!acc[tierKey][timeKey][job.cluster]) {
      acc[tierKey][timeKey][job.cluster] = {...job.errorAnalysis};
    } else {
      Object.keys(job.errorAnalysis).forEach(errorType => {
        acc[tierKey][timeKey][job.cluster][errorType] = (acc[tierKey][timeKey][job.cluster][errorType] || 0) + job.errorAnalysis[errorType];
      });
    }
    return acc;
  }, { tier2: { today: {}, week: {}, month: {} }, tier3: { today: {}, week: {}, month: {} } });
}

// Aggregate error analysis data
export const errorAnalysisData: JobData = aggregateErrorAnalysis([...todayJobs, ...weekJobs, ...monthJobs]);

// ==================== Error Clustering ====================

interface ErrorClusteredJob {
  id: string;
  name: string;
  startTime: string;
  duration: string;
}

interface ErrorClusteredJobs {
  tier2: {
    today: Record<string, ErrorClusteredJob[]>;
    week: Record<string, ErrorClusteredJob[]>;
    month: Record<string, ErrorClusteredJob[]>;
  };
  tier3: {
    today: Record<string, ErrorClusteredJob[]>;
    week: Record<string, ErrorClusteredJob[]>;
    month: Record<string, ErrorClusteredJob[]>;
  };
}

/**
 * Aggregates jobs by error type
 * @param jobs An array of Job objects
 * @returns An ErrorClusteredJobs object containing jobs clustered by error type
 */
function aggregateErrorClusteredJobs(jobs: Job[]): ErrorClusteredJobs {
  return jobs.reduce((acc: ErrorClusteredJobs, job) => {
    if (job.status === 'Failed') {
      const tierKey = job.tier === 'Tier 2' ? 'tier2' : 'tier3';
      const timeKey = job.startTime > sub(now, { hours: 24 }).toISOString() ? 'today' :
                      job.startTime > sub(now, { days: 7 }).toISOString() ? 'week' : 'month';
      
      if (!acc[tierKey][timeKey][job.errorMessage]) {
        acc[tierKey][timeKey][job.errorMessage] = [];
      }
      
      acc[tierKey][timeKey][job.errorMessage].push({
        id: job.id,
        name: job.name,
        startTime: job.startTime,
        duration: job.duration
      });
    }
    return acc;
  }, { tier2: { today: {}, week: {}, month: {} }, tier3: { today: {}, week: {}, month: {} } });
}

// Aggregate error clustered jobs
export const errorClusteredJobs: ErrorClusteredJobs = aggregateErrorClusteredJobs([...todayJobs, ...weekJobs, ...monthJobs]);

// ==================== Detailed Error Analysis ====================

interface DetailedErrorJob {
  id: string;
  name: string;
  cluster: string;
  startTime: string;
  duration: string;
  recordsProcessed: number;
  errorDetails: {
    message: string;
    failedStep: string;
    affectedRecords: number;
  };
}

interface DetailedErrorClusters {
  tier2: {
    today: Record<string, DetailedErrorJob[]>;
    week: Record<string, DetailedErrorJob[]>;
    month: Record<string, DetailedErrorJob[]>;
  };
  tier3: {
    today: Record<string, DetailedErrorJob[]>;
    week: Record<string, DetailedErrorJob[]>;
    month: Record<string, DetailedErrorJob[]>;
  };
}

/**
 * Generates detailed error cluster data
 * @param jobs An array of Job objects
 * @returns A DetailedErrorClusters object containing detailed error information
 */
function generateDetailedErrorClusterData(jobs: Job[]): DetailedErrorClusters {
  const errorClusters: DetailedErrorClusters = { 
    tier2: { today: {}, week: {}, month: {} }, 
    tier3: { today: {}, week: {}, month: {} } 
  };

  jobs.forEach(job => {
    if (job.status === 'Failed') {
      const tierKey = job.tier === 'Tier 2' ? 'tier2' : 'tier3';
      const timeKey = job.startTime > sub(now, { hours: 24 }).toISOString() ? 'today' :
                      job.startTime > sub(now, { days: 7 }).toISOString() ? 'week' : 'month';
      
      const errorType = job.errorMessage.replace(' occurred', '');
      
      if (!errorClusters[tierKey][timeKey][errorType]) {
        errorClusters[tierKey][timeKey][errorType] = [];
      }
      
      errorClusters[tierKey][timeKey][errorType].push({
        id: job.id,
        name: job.name,
        cluster: job.cluster,
        startTime: job.startTime,
        duration: job.duration,
        recordsProcessed: job.recordsProcessed,
        errorDetails: {
          message: job.errorMessage,
          failedStep: job.steps.find(step => step.status === 'Failed')?.name || 'Unknown',
          affectedRecords: Math.floor(job.recordsProcessed * Math.random()) // Simulate affected records
        }
      });
    }
  });

  return errorClusters;
}

// Generate detailed error cluster data
export const detailedErrorClusters: DetailedErrorClusters = generateDetailedErrorClusterData([...todayJobs, ...weekJobs, ...monthJobs]);

// ==================== Helper Functions ====================

/**
 * Retrieves job load analysis data for a specific job and load
 * @param jobId The ID of the job
 * @param loadId The ID of the load
 * @param periodType The type of period to retrieve data for
 * @returns An array of PeriodicDataPoint objects
 */
export function getJobLoadAnalysis(jobId: string, loadId: string, periodType: 'day' | 'week' | 'month'): DailyDataPoint[] | AggregatedDataPoint[] {
  const job = jobDetails[jobId];
  if (!job) return [];

  const relevantLoad = job.jobLoads.find(load => load.loadId === loadId);
  if (!relevantLoad) return [];

  return periodType === 'day' ? relevantLoad.dailyData : aggregateData(relevantLoad.dailyData, periodType);
}

/**
 * Retrieves error cluster details for a specific tier, time range, and error type
 * @param tier The tier ('tier1' or 'tier2')
 * @param timeRange The time range ('today', 'week', or 'month')
 * @param errorType The type of error
 * @returns An array of DetailedErrorJob objects
 */
export function getErrorClusterDetails(tier: 'tier2' | 'tier3', timeRange: 'today' | 'week' | 'month', errorType: string): DetailedErrorJob[] {
  return detailedErrorClusters[tier][timeRange][errorType] || [];
}

/**
 * Retrieves aggregated data for a specific tier and time range
 * @param tier The tier ('tier1' or 'tier2')
 * @param timeRange The time range ('today', 'week', or 'month')
 * @returns A ClusterData object containing aggregated job statistics
 */
export function getAggregatedData(tier: 'tier2' | 'tier3', timeRange: 'today' | 'week' | 'month'): ClusterData {
  const tierData = jobData[tier][timeRange];
  if (!tierData) {
    console.warn(`No data found for ${tier} in ${timeRange}`);
    return {
      activeJobs: 0,
      runningJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      notRunningJobs: 0
    };
  }
  return Object.values(tierData).reduce((acc, clusterData) => {
    acc.activeJobs += clusterData.activeJobs;
    acc.runningJobs += clusterData.runningJobs;
    acc.completedJobs += clusterData.completedJobs;
    acc.failedJobs += clusterData.failedJobs;
    acc.notRunningJobs += clusterData.notRunningJobs;
    return acc;
  }, {
    activeJobs: 0,
    runningJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    notRunningJobs: 0
  });
}

/**
 * Retrieves error analysis data for a specific tier and time range
 * @param tier The tier ('tier1' or 'tier2')
 * @param timeRange The time range ('today', 'week', or 'month')
 * @returns A Record object containing error types and their counts
 */
export function getErrorAnalysisData(tier: 'tier2' | 'tier3', timeRange: 'today' | 'week' | 'month'): Record<string, number> {
  const tierData = errorAnalysisData[tier][timeRange];
  if (!tierData) {
    console.warn(`No error analysis data found for ${tier} in ${timeRange}`);
    return {};
  }
  return Object.values(tierData).reduce((acc, clusterErrors) => {
    Object.entries(clusterErrors).forEach(([errorType, count]) => {
      acc[errorType] = (acc[errorType] || 0) + count;
    });
    return acc;
  }, {} as Record<string, number>);
}