# Admission Service

Public admission forms are opened with a college-specific link:

- `/api/v1/admission/public/code/{collegeCode}/apply`
- `/api/v1/admission/public/id/{collegeId}/apply`

Applicants do not authenticate. Applications are stored in the admission database.

College Admin endpoints require the existing JWT, the matching `CollegeId` header, the `ADMISSION` module, and admission permissions.

Student creation is intentionally not part of this service. It remains in Class Service and can be done later by a College Admin.

Email is intentionally not sent by this service. Approval/rejection methods contain the integration points for the future Notification Service.
