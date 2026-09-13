# ⚠️ Offline Preview Mode & Mock Data Guide

## 📌 Why this exists
Currently, the backend microservices (Core, Class, Admission, Fee, etc.) are offline / not running. To allow full live interactive visual development, navigation, and testing of every page in the browser without getting blocked by authentication or missing backend responses, **Preview Mode** has been enabled.

---

## 🎯 Master Switch Location
All mock data and the master switch are centralized in:
- [`src/utils/mockData.js`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/utils/mockData.js)

```javascript
// Toggle this single boolean:
export const IS_PREVIEW_MODE = true; // Set to false when backend is running!
```

---

## 📂 Components & Pages Using Mock Fallbacks

| File | Purpose in Preview Mode | Action Needed When Backend Starts |
| :--- | :--- | :--- |
| [`src/context/AuthContext.jsx`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/context/AuthContext.jsx) | Provides `MOCK_USER` with `ROLE_MAIN_ADMIN` so protected routes and role guards can be navigated freely without login. If `/login` is submitted, it logs in with mock credentials if backend is unreachable. | Remove `MOCK_USER` fallback or rely on `IS_PREVIEW_MODE = false`. |
| [`src/context/TenantContext.jsx`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/context/TenantContext.jsx) | Sets default college name to `Delhi Institute of Engineering & Technology` (`COL-DELHI-001`). | Will be populated from live `/api/v1/core/college/myCollege` API. |
| [`src/pages/users/UserManagementPage.jsx`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/pages/users/UserManagementPage.jsx) | If `userService.getCollegeUsers()` fails to connect, loads `MOCK_USER_DIRECTORY` (faculty, students, staff) and allows live in-memory creation, edit, activation, and deletion. | Seamlessly consumes live `/api/v1/core/users/college` responses. |
| [`src/pages/users/UserProfilePage.jsx`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/pages/users/UserProfilePage.jsx) | If `userService.getMyProfile()` fails to connect, loads `MOCK_PROFILE` and allows testing the contact edit and password change modals. | Seamlessly consumes live `/api/v1/core/users/me` responses. |

---

## 🔄 How to Switch Back to Live Backend
1. Open [`src/utils/mockData.js`](file:///c:/Antigravity/MultiTenantFrontend/frontend/src/utils/mockData.js).
2. Set `export const IS_PREVIEW_MODE = false;`.
3. Start the Spring Boot backend (`docker compose up -d` + `mvn spring-boot:run` in respective services).
4. The frontend will strictly authenticate against `/api/v1/core/auth/login` and query the real database.
