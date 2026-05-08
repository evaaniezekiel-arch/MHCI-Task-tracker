# MHCI Task Tracker: Executive Command Center Documentation

## 1. Overview
The **MHCI Task Tracker** has been transformed from a basic task list into a production-grade **Executive Command Center**. It is designed for high-level oversight, strategic planning, and delegated execution using an integrated AI intelligence layer.

---

## 2. Design Philosophy: "Executive Monochrome"
The platform adheres to a **Minimalist Brutalist** aesthetic, referred to as "Executive Monochrome."
- **Color Palette**: Strictly Charcoal (#131313), Deep Zinc (#1c1b1b), and Pure White.
- **Typography**: High-contrast, bold, and uppercase tracking for headers to emphasize strategic importance.
- **UI Elements**: Glassmorphism effects, sharp borders, and subtle micro-animations (via Framer Motion) to create a premium, authoritative feel.

---

## 3. Core Modules

### A. Executive Dashboard (Intelligence Portal)
The central hub for real-time organizational performance.
- **Stat Cards**: Dynamic tracking of "Strategic Intensity" (Total Tasks), "Execution Velocity" (Completion Rate), and "System Efficiency."
- **Performance Analytics**: Real-time charts showing weekly trends and monthly efficiency quotients.
- **Pending Review**: A high-density list of activities awaiting executive approval, wired directly to live Supabase data.

### B. Review Hub (Strategic Approval)
The gatekeeper for final activity completion.
- **Workflow**: Displays tasks with the `Review` status. 
- **Approval**: Executives can approve activities with one click, moving them to `Done`.
- **Transparency**: Shows assignees, priorities, and due dates at a glance.

### C. AI Strategy Lab (Tactical Intelligence)
A cross-provider AI overlay that provides context-aware strategic advice.
- **Trigger**: Accessible via the "Sparkle" icon on any task.
- **Providers**: Supports **Gemini**, **OpenAI**, and **Claude**.
- **Outputs**:
    - **Executive Summary**: A one-sentence distillation of the task's strategic value.
    - **Recommended Approach**: Step-by-step tactical execution plan.
    - **Resource Allocation**: Recommendation on which team member is best suited for the task.

### D. Weekly Strategy Overview
Integrated intelligence for long-term planning.
- **Global Intelligence Overlay**: Uses AI to analyze an entire week's worth of tasks.
- **Strategic Load**: Predicts bottlenecks and workload density.
- **Efficiency Forecast**: Forecasts the likelihood of meeting Friday deadlines based on current progress.

---

## 4. Administrative Controls

### A. AI Intelligence Management
Strictly restricted to **Admin** roles.
- **Key Management**: Securely store and manage API keys for Google, OpenAI, and Anthropic.
- **Model Selection**: Choose specific models (e.g., `gemini-1.5-pro`, `gpt-4o`, `claude-3-opus`) per provider.
- **Token Limits**: Control costs by setting max token boundaries for AI analysis.

### B. User & Role Management
A three-tier access control system.
- **Admin**: Full system control, including AI and user configuration.
- **Executive**: Strategic oversight, task creation, and approval workflows.
- **Assistant**: Task execution and status updates (cannot create or delete high-level entities).
- **Temporary Promotion**: Ability for admins to grant temporary "Admin" status to users for specific time windows (1-24 hours).

---

## 5. Technical Infrastructure

### Backend (Supabase)
- **Database**: PostgreSQL with real-time subscriptions for instant UI updates.
- **Tables**:
    - `tasks`: Core task data (Title, Status, Priority, Assignee).
    - `profiles`: User roles and metadata.
    - `ai_config`: Secure encrypted storage for API keys.
- **Constraints**: Enforced status enums (`Pending`, `Progress`, `Review`, `Done`) and roles (`admin`, `executive`, `assistant`).

### Frontend (Next.js 15)
- **Framework**: App Router with Server Actions for secure, type-safe data mutations.
- **State Management**: React Hooks (useState/useEffect) combined with Supabase Realtime.
- **Styling**: Vanilla CSS with Tailwind utility classes for the monochrome design system.

---

## 6. Execution Workflow
1. **Initiation**: Executive creates a task in a specific Week view.
2. **Delegation**: Task is assigned to an Assistant.
3. **Execution**: Assistant works on the task and updates status to `Progress`.
4. **Submission**: Assistant moves task to `Review`.
5. **Approval**: Executive views task in **Review Hub**, consults **AI Strategy Lab** if needed, and clicks **Approve**.
6. **Completion**: Task moves to `Done` and reflects in the global efficiency charts.

---

## 7. Future Roadmap
- **Deep Assistant Analytics**: Detailed throughput tracking per assistant.
- **Automated Delegation**: AI-suggested assignees based on historical performance.
- **Multi-Tenant Support**: Ability to manage multiple command centers under one account.
