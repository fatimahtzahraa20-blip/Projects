# Hotel Owner Registration & Approval Workflow Platform
## Functional Specification Document
**Date:** 07 August 2026

### 1. Hotel Owner Onboarding
Two pathways for hotels to join:
*   **Admin Adds Hotel:** Manual creation and assignment.
*   **Owner Registration Request:** Public-facing sign-up form.

#### Registration Request Fields:
*   Hotel Name, Business/Owner Name
*   Email, Phone Number
*   Address, City, Country, Google Maps Location
*   Description, Number of Rooms, Category (1–5 Star, etc.)
*   Business License (Upload), Identity Verification (CNIC)
*   Logo & Cover Image

### 2. Approval Workflow
*   **Initial Status:** Pending Approval (Locked).
*   **Admin Actions:** Review, Approve, Reject, Request Info.
*   **Post-Approval:** Notification sent, Dashboard unlocked.
*   **Post-Rejection:** Admin provides reason, owner can edit and resubmit.

### 3. Hotel Owner Dashboard (Post-Approval)
*   Profile Management (Logo, Cover, Gallery)
*   Room Management (Categories, Photos, Amenities, Pricing, Availability)
*   Booking Management (Accept/Reject, Calendar)
*   Customer Engagement (Reviews & Responses)
*   Analytics (Revenue, Booking Trends)
*   Services (Cleaning requests based on eligibility)

### 4. Admin Hotel Management
*   **Queues:** Pending, Approved, Rejected, Suspended.
*   **Management Actions:** Full edit, Verify, Suspend/Reactivate.
*   **Operations:** Cleaning team assignment, Analytics.

### 5. Hotel Status Flow
Draft → Pending Approval → Approved → Active → Suspended.

### 6. Security & Tech
*   Supabase Row Level Security (RLS).
*   Role-based access control (RBAC).
*   Data isolation (Owners only see their own data).