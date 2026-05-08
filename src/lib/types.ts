export type Role = 'admin' | 'executive' | 'assistant' | 'member';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'Done' | 'In-Progress' | 'Pending' | 'Undone' | 'KIV' | 'Review';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: Role;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Week {
  id: string;
  week_number: number;
  start_date: string;
  end_date: string;
  year: number;
  created_by: string | null;
}

export interface Task {
  id: string;
  week_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
  status: Status;
  notes: string | null;
  position: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  assignees?: TaskAssignee[];
}

export interface TaskAssignee {
  id: string;
  task_id: string;
  user_id: string | null;
  invited_email: string | null;
  invite_token: string | null;
  invite_status: 'pending' | 'accepted' | 'declined';
  assigned_by: string;
  assigned_at: string;
  profile?: Profile;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}
