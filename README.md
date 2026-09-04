# SASSA Digital Assistant

You are building a full-featured web-based AI Productivity Assistant for the South African Social Security Agency (SASSA). This platform helps SASSA staff automate repetitive administrative tasks, improve response times to beneficiaries, and enhance internal workflow efficiency. The solution must be a complete system with authentication, a professional homepage, and a dashboard, all tailored to the high-volume, high-stakes environment of government social grant management.

2. Core Platform Requirements (Must-Have)

🔐 Authentication & Homepage

Login Page – Secure authentication (email + password) with a clean, professional design.

Registration Page – New user sign-up with role selection (Admin, Manager, Officer).

Homepage (Landing) – Welcoming page with:

SASSA branding (name, logo placeholder).

Brief platform description.

Navigation to Login/Register.

Footer with disclaimer and support info.

📊 Dashboard (Post-Login)

Color Theme: Use White as primary background, Yellow for headers/alerts, and Gold for success indicators and positive metrics.

Key Metrics Cards: Display:

Total grants processed today.

Pending applications.

Outstanding action items.

Recent system activity.

Quick Action Buttons – One-click access to the 5 core tools (Email Generator, Meeting Summarizer, Task Planner, Research Assistant, Chatbot).

Recent Activity Feed – Show latest user actions and AI-generated outputs.

3. Five Core AI Functionalities (Fully Integrated)

Build these as standalone modules accessible from the dashboard:

ToolSASSA-Specific PurposeSmart Email GeneratorDraft formal letters, beneficiary responses, internal memos. Support tone variations (formal, empathetic, urgent). Include language hints (English/isiZulu/Afrikaans).Meeting Notes SummarizerExtract decisions, action items, responsibilities, and deadlines from meeting transcripts.AI Task PlannerGenerate prioritized daily/weekly schedules from a task list.AI Research AssistantSummarize policies (e.g., Social Assistance Act) and simplify complex reports.AI Chatbot InterfaceInteractive chat to answer standard beneficiary queries (e.g., "How do I check my balance?"). Include disclaimers.

4. Additional System Features (To Make It Complete)

Responsive Design – Works on mobile, tablet, and desktop.

User Profile – View and edit basic profile info.

History Log – View past AI-generated outputs per user.

Export Function – Download emails or summaries as PDF/Word.

Notification Badge – Alert user for pending actions.

Help/Support Page – Short guide on using the tools.

5. Responsible AI & Ethical Constraints (Critical)

Data Privacy (POPIA): Include disclaimers that no beneficiary personal data is stored by the AI.

Accuracy Checks: Add validation steps and warnings that outputs must be reviewed by staff before final use.

Bias Mitigation: Ensure prompts use inclusive, clear language accessible to all South Africans.

Language: Build prompts that can handle at least English and isiZulu queries.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sassa-assist-bot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/04a87544-08fd-4158-8b3f-c9f940da8d9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
