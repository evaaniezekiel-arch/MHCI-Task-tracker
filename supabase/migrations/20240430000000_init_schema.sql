-- profiles (mirrors auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT UNIQUE,
  role        TEXT NOT NULL DEFAULT 'admin'
              CHECK (role IN ('admin','executive','member')),
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- weeks
CREATE TABLE weeks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number  INT NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  year         INT NOT NULL DEFAULT 2025,
  created_by   UUID REFERENCES profiles(id),
  UNIQUE(week_number, year)
);

-- tasks
CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id      UUID REFERENCES weeks(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  priority     TEXT DEFAULT 'Medium'
               CHECK (priority IN ('High','Medium','Low')),
  due_date     DATE,
  status       TEXT DEFAULT 'Pending'
               CHECK (status IN ('Done','In-Progress','Pending','Undone','KIV')),
  notes        TEXT,
  position     INT DEFAULT 0,
  created_by   UUID REFERENCES profiles(id),
  updated_by   UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- task_assignees (many-to-many: tasks <-> users)
CREATE TABLE task_assignees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  invited_email TEXT,          -- set if user not yet signed up
  invite_token  TEXT UNIQUE,   -- UUID token for magic-link acceptance
  invite_status TEXT DEFAULT 'pending'
                CHECK (invite_status IN ('pending','accepted','declined')),
  assigned_by   UUID REFERENCES profiles(id),
  assigned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, user_id),
  CHECK (
    (user_id IS NOT NULL AND invited_email IS NULL) OR
    (user_id IS NULL AND invited_email IS NOT NULL)
  )
);

-- comments
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id),
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- platform_invites (admin inviting new users to join the platform)
CREATE TABLE platform_invites (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL,
  role           TEXT DEFAULT 'member'
                 CHECK (role IN ('executive','member')),
  token          TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  invited_by     UUID REFERENCES profiles(id),
  accepted       BOOLEAN DEFAULT FALSE,
  expires_at     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
