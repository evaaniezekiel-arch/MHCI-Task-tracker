-- Migration: 20240507000001_fix_constraints.sql
-- Update role and priority constraints to match executive requirements

-- Update profiles role constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'executive', 'assistant', 'member'));

-- Update tasks priority constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('Critical', 'High', 'Medium', 'Low'));

-- Update tasks status constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('Done', 'In-Progress', 'Pending', 'Undone', 'KIV', 'Review'));
