import { sub } from 'date-fns';

const now = new Date();

export const jobData = {
  today: {
    activeJobs: 20,
    completedJobs: 15,
    failedJobs: 2,
    pendingJobs: 3
  },
  week: {
    activeJobs: 20,
    completedJobs: 105,
    failedJobs: 14,
    pendingJobs: 3
  },
  month: {
    activeJobs: 20,
    completedJobs: 980,
    failedJobs: 45,
    pendingJobs: 3
  }
};

export const jobStatusData = {
  today: {
    completed: 15,
    failed: 2,
    pending: 3
  },
  week: {
    completed: 105,
    failed: 14,
    pending: 3
  },
  month: {
    completed: 980,
    failed: 45,
    pending: 3
  }
};

export const errorAnalysisData = {
  today: {
    'Connection Timeout': 2,
    'Data Validation Error': 1,
    'Transformation Error': 1,
    'Source Data Unavailable': 0,
    'Insufficient Resources': 0
  },
  week: {
    'Connection Timeout': 5,
    'Data Validation Error': 3,
    'Transformation Error': 2,
    'Source Data Unavailable': 1,
    'Insufficient Resources': 3
  },
  month: {
    'Connection Timeout': 15,
    'Data Validation Error': 10,
    'Transformation Error': 8,
    'Source Data Unavailable': 5,
    'Insufficient Resources': 7
  }
};

export const errorClusteredJobs = {
  today: {
    'Connection Timeout': [
      { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', startTime: '2023-09-13 09:00', duration: '1h 30m' },
      { id: 'JOB002', name: 'REG_D_REPRESENTATIF', startTime: '2023-09-13 10:30', duration: '15m' }
    ],
    'Data Validation Error': [
      { id: 'JOB003', name: 'REG_D_REPRESENTATIF_LAYANAN', startTime: '2023-09-13 11:45', duration: '45m' }
    ],
    'Transformation Error': [
      { id: 'JOB004', name: 'REG_D_REPRESENTATIF_PERAN', startTime: '2023-09-13 13:00', duration: '2h' }
    ],
    'Source Data Unavailable': [],
    'Insufficient Resources': []
  },
  week: {
    'Connection Timeout': [
      { id: 'JOB005', name: 'REG_D_WP_ALAMAT', startTime: '2023-09-10 08:00', duration: '3h' },
      { id: 'JOB006', name: 'REG_D_WP_BANK', startTime: '2023-09-11 14:00', duration: '1h' },
      { id: 'JOB007', name: 'REG_D_WP_EKONOMI', startTime: '2023-09-12 10:00', duration: '2h 30m' },
      { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', startTime: '2023-09-13 09:00', duration: '1h 30m' },
      { id: 'JOB002', name: 'REG_D_REPRESENTATIF', startTime: '2023-09-13 10:30', duration: '15m' }
    ],
    'Data Validation Error': [
      { id: 'JOB008', name: 'REG_D_WP_IDENTITAS', startTime: '2023-09-09 11:00', duration: '4h' },
      { id: 'JOB009', name: 'REG_D_WP_KEGIATAN', startTime: '2023-09-11 09:30', duration: '2h' },
      { id: 'JOB003', name: 'REG_D_REPRESENTATIF_LAYANAN', startTime: '2023-09-13 11:45', duration: '45m' }
    ],
    'Transformation Error': [
      { id: 'JOB010', name: 'REG_D_WP_KONTAK', startTime: '2023-09-10 13:00', duration: '1h 30m' },
      { id: 'JOB004', name: 'REG_D_REPRESENTATIF_PERAN', startTime: '2023-09-13 13:00', duration: '2h' }
    ],
    'Source Data Unavailable': [
      { id: 'JOB011', name: 'REG_D_WP_KORPORASI', startTime: '2023-09-12 08:30', duration: '1h' }
    ],
    'Insufficient Resources': [
      { id: 'JOB012', name: 'REG_D_WP_KUASA', startTime: '2023-09-11 22:00', duration: '6h' },
      { id: 'JOB013', name: 'REG_D_WP_ORANG_PRIBADI', startTime: '2023-09-12 01:00', duration: '8h' },
      { id: 'JOB014', name: 'REG_D_WP_PENGURUS', startTime: '2023-09-13 03:00', duration: '4h' }
    ]
  },
  month: {
    'Connection Timeout': [
      { id: 'JOB015', name: 'REG_D_WP_PERWAKILAN', startTime: '2023-08-31 23:00', duration: '2h' },
      { id: 'JOB016', name: 'REG_D_WP_USAHA', startTime: '2023-09-01 10:00', duration: '3h' },
      { id: 'JOB017', name: 'REG_M_AGAMA', startTime: '2023-09-02 08:00', duration: '4h' },
      { id: 'JOB018', name: 'REG_M_BENTUK_KERJASAMA', startTime: '2023-09-03 14:00', duration: '2h' },
      { id: 'JOB019', name: 'REG_M_BIDANG_USAHA', startTime: '2023-09-04 22:00', duration: '5h' },
      { id: 'JOB020', name: 'REG_M_DOKUMEN', startTime: '2023-09-05 01:00', duration: '3h' },
      { id: 'JOB021', name: 'REG_M_DOKUMEN_PERSYARATAN', startTime: '2023-09-06 09:00', duration: '4h' },
      { id: 'JOB022', name: 'REG_M_GOLONGAN_DARAH', startTime: '2023-09-07 11:00', duration: '6h' },
      { id: 'JOB023', name: 'REG_M_JABATAN', startTime: '2023-09-08 08:00', duration: '3h' },
      { id: 'JOB024', name: 'REG_M_JENIS_IDENTITAS', startTime: '2023-09-09 00:00', duration: '5h' },
      { id: 'JOB005', name: 'REG_D_WP_ALAMAT', startTime: '2023-09-10 08:00', duration: '3h' },
      { id: 'JOB006', name: 'REG_D_WP_BANK', startTime: '2023-09-11 14:00', duration: '1h' },
      { id: 'JOB007', name: 'REG_D_WP_EKONOMI', startTime: '2023-09-12 10:00', duration: '2h 30m' },
      { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', startTime: '2023-09-13 09:00', duration: '1h 30m' },
      { id: 'JOB002', name: 'REG_D_REPRESENTATIF', startTime: '2023-09-13 10:30', duration: '15m' }
    ],
    'Data Validation Error': [
      { id: 'JOB025', name: 'REG_M_JENIS_PAJAK', startTime: '2023-08-15 10:00', duration: '5h' },
      { id: 'JOB026', name: 'REG_M_JENIS_PERMOHONAN', startTime: '2023-08-20 09:00', duration: '3h' },
      { id: 'JOB027', name: 'REG_M_JENIS_REGISTRASI', startTime: '2023-08-25 14:00', duration: '4h' },
      { id: 'JOB028', name: 'REG_M_JENIS_WP', startTime: '2023-08-30 11:00', duration: '3h' },
      { id: 'JOB008', name: 'REG_D_WP_IDENTITAS', startTime: '2023-09-09 11:00', duration: '4h' },
      { id: 'JOB009', name: 'REG_D_WP_KEGIATAN', startTime: '2023-09-11 09:30', duration: '2h' },
      { id: 'JOB003', name: 'REG_D_REPRESENTATIF_LAYANAN', startTime: '2023-09-13 11:45', duration: '45m' }
    ],
    'Transformation Error': [
      { id: 'JOB029', name: 'REG_M_KATEGORI_WP', startTime: '2023-08-18 08:00', duration: '10h' },
      { id: 'JOB030', name: 'REG_M_KECAMATAN', startTime: '2023-08-23 13:00', duration: '6h' },
      { id: 'JOB031', name: 'REG_M_KELURAHAN', startTime: '2023-08-28 22:00', duration: '8h' },
      { id: 'JOB010', name: 'REG_D_WP_KONTAK', startTime: '2023-09-10 13:00', duration: '1h 30m' },
      { id: 'JOB004', name: 'REG_D_REPRESENTATIF_PERAN', startTime: '2023-09-13 13:00', duration: '2h' }
    ],
    'Source Data Unavailable': [
      { id: 'JOB032', name: 'REG_M_KODE_POS', startTime: '2023-08-17 09:00', duration: '4h' },
      { id: 'JOB033', name: 'REG_M_KOTA', startTime: '2023-08-24 11:00', duration: '3h' },
      { id: 'JOB034', name: 'REG_M_NEGARA', startTime: '2023-08-31 01:00', duration: '5h' },
      { id: 'JOB011', name: 'REG_D_WP_KORPORASI', startTime: '2023-09-12 08:30', duration: '1h' }
    ],
    'Insufficient Resources': [
      { id: 'JOB035', name: 'REG_M_PEKERJAAN', startTime: '2023-08-16 23:00', duration: '12h' },
      { id: 'JOB036', name: 'REG_M_PENDIDIKAN', startTime: '2023-08-22 20:00', duration: '15h' },
      { id: 'JOB037', name: 'REG_M_PROVINSI', startTime: '2023-08-29 18:00', duration: '8h' },
      { id: 'JOB012', name: 'REG_D_WP_KUASA', startTime: '2023-09-11 22:00', duration: '6h' },
      { id: 'JOB013', name: 'REG_D_WP_ORANG_PRIBADI', startTime: '2023-09-12 01:00', duration: '8h' },
      { id: 'JOB014', name: 'REG_D_WP_PENGURUS', startTime: '2023-09-13 03:00', duration: '4h' }
    ]
  }
};
    
    export const recentJobs = {
      today: [
        { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', status: 'Completed', startTime: '2023-09-13 09:00', duration: '1h 30m', recordsProcessed: 50000, errorMessage: '-' },
        { id: 'JOB002', name: 'REG_D_REPRESENTATIF', status: 'Failed', startTime: '2023-09-13 10:30', duration: '15m', recordsProcessed: 5000, errorMessage: 'Connection timeout' },
        { id: 'JOB003', name: 'REG_D_REPRESENTATIF_LAYANAN', status: 'In Progress', startTime: '2023-09-13 11:45', duration: '45m', recordsProcessed: 30000, errorMessage: '-' },
      ],
      week: [
        { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', status: 'Completed', startTime: '2023-09-13 09:00', duration: '1h 30m', recordsProcessed: 50000, errorMessage: '-' },
        { id: 'JOB002', name: 'REG_D_REPRESENTATIF', status: 'Failed', startTime: '2023-09-13 10:30', duration: '15m', recordsProcessed: 5000, errorMessage: 'Connection timeout' },
        { id: 'JOB003', name: 'REG_D_REPRESENTATIF_LAYANAN', status: 'Completed', startTime: '2023-09-11 11:45', duration: '1h', recordsProcessed: 40000, errorMessage: '-' },
        { id: 'JOB004', name: 'REG_D_REPRESENTATIF_PERAN', status: 'Completed', startTime: '2023-09-10 13:00', duration: '2h', recordsProcessed: 100000, errorMessage: '-' },
        { id: 'JOB005', name: 'REG_D_WP_ALAMAT', status: 'Completed', startTime: '2023-09-09 08:00', duration: '3h', recordsProcessed: 200000, errorMessage: '-' },
      ],
      month: [
        { id: 'JOB001', name: 'REG_D_OBJEK_PAJAK', status: 'Completed', startTime: '2023-09-13 09:00', duration: '1h 30m', recordsProcessed: 50000, errorMessage: '-' },
        { id: 'JOB002', name: 'REG_D_REPRESENTATIF', status: 'Failed', startTime: '2023-09-13 10:30', duration: '15m', recordsProcessed: 5000, errorMessage: 'Connection timeout' },
        { id: 'JOB015', name: 'REG_D_REPRESENTATIF_LAYANAN', status: 'Completed', startTime: '2023-08-31 23:00', duration: '2h', recordsProcessed: 500000, errorMessage: '-' },
        { id: 'JOB025', name: 'REG_D_REPRESENTATIF_PERAN', status: 'Failed', startTime: '2023-08-15 10:00', duration: '5h', recordsProcessed: 250000, errorMessage: 'Data validation error' },
        { id: 'JOB029', name: 'REG_D_WP_ALAMAT', status: 'Failed', startTime: '2023-08-18 08:00', duration: '10h', recordsProcessed: 1000000, errorMessage: 'Transformation error' },
        { id: 'JOB032', name: 'REG_D_WP_BANK', status: 'Failed', startTime: '2023-08-17 09:00', duration: '4h', recordsProcessed: 75000, errorMessage: 'Source data unavailable' },
        { id: 'JOB035', name: 'REG_D_WP_EKONOMI', status: 'Failed', startTime: '2023-08-16 23:00', duration: '12h', recordsProcessed: 2000000, errorMessage: 'Insufficient resources' }
      ]
    };
  
  export const jobDetails: { [key: string]: any } = {
    'JOB001': {
      id: 'JOB001',
      name: 'Daily Sales ETL',
      description: 'Extract, transform, and load daily sales data from multiple sources into the data warehouse.',
      status: 'Completed',
      startTime: sub(now, { hours: 2 }).toISOString(),
      endTime: sub(now, { minutes: 30 }).toISOString(),
      duration: '1h 30m',
      recordsProcessed: 50000,
      errorMessage: '-',
      sourceSystem: 'POS Database, E-commerce Platform',
      targetSystem: 'Data Warehouse',
      steps: [
        { name: 'Extract Sales Data', status: 'Completed', startTime: sub(now, { hours: 2 }).toISOString(), endTime: sub(now, { hours: 1, minutes: 40 }).toISOString(), duration: '20m', recordsProcessed: 50000 },
        { name: 'Transform Data', status: 'Completed', startTime: sub(now, { hours: 1, minutes: 40 }).toISOString(), endTime: sub(now, { hours: 1 }).toISOString(), duration: '40m', recordsProcessed: 50000 },
        { name: 'Load to Data Warehouse', status: 'Completed', startTime: sub(now, { hours: 1 }).toISOString(), endTime: sub(now, { minutes: 30 }).toISOString(), duration: '30m', recordsProcessed: 50000 }
      ],
      errorAnalysis: {
        'Connection Timeout': 1,
        'Data Validation Error': 2,
        'Transformation Error': 1,
        'Source Data Unavailable': 0,
        'Insufficient Resources': 0,
        'Others': 1
      },
      logs: [
        { timestamp: sub(now, { hours: 2 }).toISOString(), level: 'INFO', component: 'JobController', message: 'Starting daily ETL process' },
        { timestamp: sub(now, { hours: 1, minutes: 59 }).toISOString(), level: 'INFO', component: 'DataExtractor', message: 'Connecting to source database' },
        { timestamp: sub(now, { hours: 1, minutes: 58 }).toISOString(), level: 'INFO', component: 'DataExtractor', message: 'Extracting sales data' },
        { timestamp: sub(now, { hours: 1, minutes: 40 }).toISOString(), level: 'INFO', component: 'DataExtractor', message: 'Extraction complete. 50,000 records processed' },
        { timestamp: sub(now, { hours: 1, minutes: 39 }).toISOString(), level: 'INFO', component: 'DataTransformer', message: 'Starting data transformation' },
        { timestamp: sub(now, { hours: 1, minutes: 30 }).toISOString(), level: 'WARNING', component: 'DataTransformer', message: 'Encountered 10 records with missing values' },
        { timestamp: sub(now, { hours: 1 }).toISOString(), level: 'INFO', component: 'DataTransformer', message: 'Data transformation complete' },
        { timestamp: sub(now, { minutes: 59 }).toISOString(), level: 'INFO', component: 'DataLoader', message: 'Initiating load to data warehouse' },
        { timestamp: sub(now, { minutes: 45 }).toISOString(), level: 'ERROR', component: 'DataLoader', message: 'Connection timeout to data warehouse' },
        { timestamp: sub(now, { minutes: 44 }).toISOString(), level: 'INFO', component: 'DataLoader', message: 'Retrying connection...' },
        { timestamp: sub(now, { minutes: 43 }).toISOString(), level: 'INFO', component: 'DataLoader', message: 'Connection established. Resuming data load' },
        { timestamp: sub(now, { minutes: 31 }).toISOString(), level: 'INFO', component: 'DataLoader', message: 'Data load complete' },
        { timestamp: sub(now, { minutes: 30 }).toISOString(), level: 'INFO', component: 'JobController', message: 'Daily ETL process completed successfully' }
      ]
    },
    'JOB002': {
      id: 'JOB002',
      name: 'Customer Data Update',
      description: 'Update customer information and synchronize across all systems.',
      status: 'Failed',
      startTime: sub(now, { hours: 1 }).toISOString(),
      endTime: sub(now, { minutes: 45 }).toISOString(),
      duration: '15m',
      recordsProcessed: 5000,
      errorMessage: 'Connection timeout',
      sourceSystem: 'CRM System',
      targetSystem: 'Customer Database',
      steps: [
        { name: 'Extract Updated Records', status: 'Completed', startTime: sub(now, { hours: 1 }).toISOString(), endTime: sub(now, { minutes: 55 }).toISOString(), duration: '5m', recordsProcessed: 5000 },
        { name: 'Validate Data', status: 'Completed', startTime: sub(now, { minutes: 55 }).toISOString(), endTime: sub(now, { minutes: 50 }).toISOString(), duration: '5m', recordsProcessed: 5000 },
        { name: 'Update Customer Database', status: 'Failed', startTime: sub(now, { minutes: 50 }).toISOString(), endTime: sub(now, { minutes: 45 }).toISOString(), duration: '5m', recordsProcessed: 0 }
      ],
      errorAnalysis: {
        'Connection Timeout': 1,
        'Data Validation Error': 0,
        'Transformation Error': 0,
        'Source Data Unavailable': 0,
        'Insufficient Resources': 0,
        'Others': 0
      },
      logs: [
        { timestamp: sub(now, { hours: 1 }).toISOString(), level: 'INFO', component: 'JobController', message: 'Starting Customer Data Update job' },
        { timestamp: sub(now, { minutes: 59 }).toISOString(), level: 'INFO', component: 'DataExtractor', message: 'Connecting to CRM System' },
        { timestamp: sub(now, { minutes: 55 }).toISOString(), level: 'INFO', component: 'DataExtractor', message: 'Extraction complete. 5,000 records processed' },
        { timestamp: sub(now, { minutes: 54 }).toISOString(), level: 'INFO', component: 'DataValidator', message: 'Starting data validation' },
        { timestamp: sub(now, { minutes: 50 }).toISOString(), level: 'INFO', component: 'DataValidator', message: 'Data validation complete. No issues found.' },
        { timestamp: sub(now, { minutes: 49 }).toISOString(), level: 'INFO', component: 'DataUpdater', message: 'Initiating update to Customer Database' },
        { timestamp: sub(now, { minutes: 46 }).toISOString(), level: 'ERROR', component: 'DataUpdater', message: 'Connection timeout to Customer Database' },
        { timestamp: sub(now, { minutes: 45 }).toISOString(), level: 'ERROR', component: 'JobController', message: 'Job failed due to connection timeout' }
      ]
    },
    // Add more job details as needed...
  };











  // export const jobLogs = {
  //   today: [
  //     { timestamp: '2024-09-08 09:00:00', level: 'INFO', component: 'JobController', message: 'Starting daily ETL process' },
  //     { timestamp: '2024-09-08 09:00:05', level: 'INFO', component: 'DataExtractor', message: 'Connecting to source database' },
  //     { timestamp: '2024-09-08 09:00:10', level: 'INFO', component: 'DataExtractor', message: 'Extracting sales data' },
  //     { timestamp: '2024-09-08 09:15:00', level: 'INFO', component: 'DataExtractor', message: 'Extraction complete. 50,000 records processed' },
  //     { timestamp: '2024-09-08 09:15:05', level: 'INFO', component: 'DataTransformer', message: 'Starting data transformation' },
  //     { timestamp: '2024-09-08 09:20:00', level: 'WARNING', component: 'DataTransformer', message: 'Encountered 10 records with missing values' },
  //     { timestamp: '2024-09-08 09:30:00', level: 'INFO', component: 'DataTransformer', message: 'Data transformation complete' },
  //     { timestamp: '2024-09-08 09:30:05', level: 'INFO', component: 'DataLoader', message: 'Initiating load to data warehouse' },
  //     { timestamp: '2024-09-08 09:45:00', level: 'ERROR', component: 'DataLoader', message: 'Connection timeout to data warehouse' },
  //     { timestamp: '2024-09-08 09:45:05', level: 'INFO', component: 'DataLoader', message: 'Retrying connection...' },
  //     { timestamp: '2024-09-08 09:46:00', level: 'INFO', component: 'DataLoader', message: 'Connection established. Resuming data load' },
  //     { timestamp: '2024-09-08 10:00:00', level: 'INFO', component: 'DataLoader', message: 'Data load complete' },
  //     { timestamp: '2024-09-08 10:00:05', level: 'INFO', component: 'JobController', message: 'Daily ETL process completed successfully' }
  //   ],
  //   week: [
  //     { timestamp: '2024-09-02 08:00:00', level: 'INFO', component: 'JobController', message: 'Starting weekly data aggregation' },
  //     { timestamp: '2024-09-02 08:00:10', level: 'INFO', component: 'DataAggregator', message: 'Aggregating sales data for the past week' },
  //     { timestamp: '2024-09-02 08:30:00', level: 'WARNING', component: 'DataAggregator', message: 'Missing data for store ID: 1052. Using previous week\'s data.' },
  //     { timestamp: '2024-09-02 09:00:00', level: 'INFO', component: 'DataAggregator', message: 'Weekly aggregation complete' },
  //     { timestamp: '2024-09-02 09:00:05', level: 'INFO', component: 'ReportGenerator', message: 'Generating weekly sales report' },
  //     { timestamp: '2024-09-02 09:15:00', level: 'INFO', component: 'ReportGenerator', message: 'Weekly report generated successfully' },
  //     { timestamp: '2024-09-02 09:15:05', level: 'INFO', component: 'NotificationService', message: 'Sending weekly report to stakeholders' },
  //     { timestamp: '2024-09-02 09:20:00', level: 'INFO', component: 'NotificationService', message: 'Weekly report sent successfully' },
  //     { timestamp: '2024-09-02 09:20:05', level: 'INFO', component: 'JobController', message: 'Weekly data aggregation process completed' },
  //     // ... more entries for other days of the week ...
  //     { timestamp: '2024-09-08 10:00:05', level: 'INFO', component: 'JobController', message: 'Daily ETL process completed successfully' }
  //   ],
  //   month: [
  //     { timestamp: '2024-08-01 00:00:00', level: 'INFO', component: 'JobController', message: 'Initiating monthly data archiving process' },
  //     { timestamp: '2024-08-01 00:00:10', level: 'INFO', component: 'DataArchiver', message: 'Starting to archive July 2024 data' },
  //     { timestamp: '2024-08-01 01:00:00', level: 'INFO', component: 'DataArchiver', message: 'July 2024 data archived successfully' },
  //     { timestamp: '2024-08-01 01:00:05', level: 'INFO', component: 'StorageOptimizer', message: 'Beginning storage optimization for archived data' },
  //     { timestamp: '2024-08-01 02:00:00', level: 'WARNING', component: 'StorageOptimizer', message: 'High I/O detected. Slowing down optimization process.' },
  //     { timestamp: '2024-08-01 03:00:00', level: 'INFO', component: 'StorageOptimizer', message: 'Storage optimization completed' },
  //     { timestamp: '2024-08-01 03:00:05', level: 'INFO', component: 'JobController', message: 'Monthly data archiving process completed' },
  //     // ... more entries for other days of the month ...
  //     { timestamp: '2024-09-08 10:00:05', level: 'INFO', component: 'JobController', message: 'Daily ETL process completed successfully' }
  //   ]
  // };

  