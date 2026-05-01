-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_invites ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_assigned_to(p_task_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM task_assignees
    WHERE task_id = p_task_id AND user_id = auth.uid()
  );
$$;

-- Profiles Policies
CREATE POLICY "Authenticated users can read all profiles"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE TO authenticated USING (get_my_role() = 'admin');

-- Weeks Policies
CREATE POLICY "All authenticated can read weeks"
ON weeks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage weeks"
ON weeks FOR ALL TO authenticated USING (get_my_role() = 'admin');

-- Tasks Policies
CREATE POLICY "All authenticated can read tasks"
ON tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert tasks"
ON tasks FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Admins or assigned members can update tasks"
ON tasks FOR UPDATE TO authenticated USING (
  get_my_role() = 'admin' OR 
  (get_my_role() = 'member' AND is_assigned_to(id))
);

CREATE POLICY "Admins can delete tasks"
ON tasks FOR DELETE TO authenticated USING (get_my_role() = 'admin');

-- Task Assignees Policies
CREATE POLICY "All authenticated can read assignees"
ON task_assignees FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage assignees"
ON task_assignees FOR ALL TO authenticated USING (get_my_role() = 'admin');

-- Comments Policies
CREATE POLICY "All authenticated can read comments"
ON comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins, Executives, or assigned members can insert comments"
ON comments FOR INSERT TO authenticated WITH CHECK (
  get_my_role() IN ('admin', 'executive') OR 
  (get_my_role() = 'member' AND is_assigned_to(task_id))
);

CREATE POLICY "Authors can manage own comments"
ON comments FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Platform Invites Policies
CREATE POLICY "Admins can manage platform invites"
ON platform_invites FOR ALL TO authenticated USING (get_my_role() = 'admin');
