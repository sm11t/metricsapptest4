// TypeScript types for activity and health data structure

export interface CalendarDay {
  day: string;
  date: string;
  hours: number;
  status: 'no booking' | 'booked' | 'completed';
  today?: boolean;
}

export interface SessionSummary {
  booked_hours: number;
  completed_hours: number;
  upcoming_hours: number;
  interval: 'week' | 'month';
}

export interface CurrentGoal {
  goal_sessions: number;
  completed_sessions: number;
  status: string;
  message: string;
  progress_label: string;
}

export interface ActivityOverview {
  finished: {
    one_on_one: number;
    group: number;
  };
  finished_vs_no_show: {
    finished: number;
    no_show: number;
  };
}

export interface WearableStatus {
  is_connected: boolean;
  show_health_trends: boolean;
  show_wearable_banner: boolean;
}

export interface CaloriesData {
  label: string;
  value: number;
  unit: string;
  status: string;
  hourly_values: number[];
}

export interface HeartRateRange {
  min: number;
  max: number;
}

export interface HeartRateVariability {
  label: string;
  value: number;
  unit: string;
  status: string;
  hourly_values: HeartRateRange[];
}

export interface RestingHeartRate {
  label: string;
  value: number;
  unit: string;
  status: string;
  hourly_values: HeartRateRange[];
}

export interface StressData {
  label: string;
  value: string;
  status: string;
  hourly_values: number[];
}

export interface SleepTimeline {
  percent: number;
  label: string;
  color: string;
}

export interface SleepWindow {
  start: string;
  end: string;
}

export interface SleepData {
  label: string;
  value: number;
  unit: string;
  status: string;
  timeline: SleepTimeline[];
  sleep_window: SleepWindow;
}

export interface HealthTrend {
  date: string;
  calories: CaloriesData;
  heart_rate_variability: HeartRateVariability;
  resting_heart_rate: RestingHeartRate;
  stress: StressData;
  sleep: SleepData;
}

export interface ActivityData {
  range: string;
  week_start_date: string;
  calendar: CalendarDay[];
  session_summary: SessionSummary;
  current_goal: CurrentGoal;
  activity_overview: ActivityOverview;
  wearable_status: WearableStatus;
  health_trend: HealthTrend;
}
