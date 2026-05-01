-- Add temporary admin support to profiles
ALTER TABLE profiles ADD COLUMN temporary_admin_until TIMESTAMPTZ;

-- Update the role helper to check for temporary status
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
  v_role TEXT;
  v_temp_until TIMESTAMPTZ;
BEGIN
  SELECT role, temporary_admin_until INTO v_role, v_temp_until FROM profiles WHERE id = auth.uid();
  
  -- If they are a regular user but have a valid temporary admin timestamp, treat them as admin
  IF v_role != 'admin' AND v_temp_until IS NOT NULL AND v_temp_until > NOW() THEN
    RETURN 'admin';
  END IF;
  
  RETURN v_role;
END;
$$;
