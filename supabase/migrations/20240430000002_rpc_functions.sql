-- Aggregation for Dashboard Monthly Summary
CREATE OR REPLACE FUNCTION get_monthly_summary(p_year INT)
RETURNS TABLE (
  month TEXT,
  total BIGINT,
  done BIGINT,
  in_progress BIGINT,
  pending BIGINT,
  undone BIGINT,
  kiv BIGINT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(w.start_date, 'Month') as month,
    COUNT(t.id) as total,
    COUNT(t.id) FILTER (WHERE t.status = 'Done') as done,
    COUNT(t.id) FILTER (WHERE t.status = 'In-Progress') as in_progress,
    COUNT(t.id) FILTER (WHERE t.status = 'Pending') as pending,
    COUNT(t.id) FILTER (WHERE t.status = 'Undone') as undone,
    COUNT(t.id) FILTER (WHERE t.status = 'KIV') as kiv
  FROM weeks w
  LEFT JOIN tasks t ON t.week_id = w.id
  WHERE w.year = p_year
  GROUP BY month, date_trunc('month', w.start_date)
  ORDER BY date_trunc('month', w.start_date);
END;
$$;

-- Aggregation for Weekly Trend Chart
CREATE OR REPLACE FUNCTION get_weekly_completion_trend(p_year INT)
RETURNS TABLE (
  week_number INT,
  start_date DATE,
  total_tasks BIGINT,
  done_count BIGINT,
  completion_pct NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.week_number,
    w.start_date,
    COUNT(t.id) as total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'Done') as done_count,
    CASE 
      WHEN COUNT(t.id) = 0 THEN 0 
      ELSE (COUNT(t.id) FILTER (WHERE t.status = 'Done')::NUMERIC / COUNT(t.id)::NUMERIC) * 100 
    END as completion_pct
  FROM weeks w
  LEFT JOIN tasks t ON t.week_id = w.id
  WHERE w.year = p_year
  GROUP BY w.week_number, w.start_date
  ORDER BY w.week_number;
END;
$$;

-- Aggregation for Assignee Workload
CREATE OR REPLACE FUNCTION get_assignee_workload()
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total BIGINT,
  done BIGINT,
  in_progress BIGINT,
  pending BIGINT,
  undone BIGINT,
  kiv BIGINT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    COUNT(ta.task_id) as total,
    COUNT(ta.task_id) FILTER (WHERE t.status = 'Done') as done,
    COUNT(ta.task_id) FILTER (WHERE t.status = 'In-Progress') as in_progress,
    COUNT(ta.task_id) FILTER (WHERE t.status = 'Pending') as pending,
    COUNT(ta.task_id) FILTER (WHERE t.status = 'Undone') as undone,
    COUNT(ta.task_id) FILTER (WHERE t.status = 'KIV') as kiv
  FROM profiles p
  JOIN task_assignees ta ON ta.user_id = p.id
  JOIN tasks t ON t.id = ta.task_id
  GROUP BY p.id, p.full_name, p.avatar_url;
END;
$$;

-- Overall Status Counts
CREATE OR REPLACE FUNCTION get_overall_status_counts()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT t.status, COUNT(*) as count
  FROM tasks t
  GROUP BY t.status;
END;
$$;
