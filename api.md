# PG-Connect File Listing & API Summary

## Directory Structure

```text
PG-Connect/
├── public/                 # Static assets
└── src/
    ├── app/                # Next.js Application Routes
    │   ├── api/            # API Endpoints
    │   ├── login/          # Login page
    │   ├── owner/          # Owner dashboard and Add PG views
    │   ├── pg/             # PG details and application views
    │   ├── register/       # Registration page
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/         # Reusable React components (UI, layout, forms, portfolio)
    ├── hooks/              # Custom React hooks (e.g., useAddPgForm)
    ├── lib/                # Utility functions and configurations (auth, cloudinary, mongodb)
    ├── models/             # Data models and interfaces (User, PgListing, PgApplication)
    └── proxy.ts            # Proxy setup for backend routes
```

## API Summary

The application exposes several endpoints in the `src/app/api` directory to handle various resources such as applications, authentication, and paying guest (PG) listings. The data is primarily stored in MongoDB.

### 1. PG Applications API
`src/app/api/applications/route.ts`

- **GET `/api/applications`**: Retrieves a list of applications. It supports filtering by query parameters (e.g., `?pgId=...`).
- **POST `/api/applications`**: Submits a new application. The user must be authenticated. The newly created application starts with a `PENDING` status.
- **PATCH `/api/applications`**: Updates the state of an application (e.g., approve or reject). The user must be authenticated with the `PG_OWNER` role. If an application is `APPROVED`, it also updates the current occupancy of the related PG listing.

### 2. Authentication API
`src/app/api/auth/register/route.ts` & `src/app/api/auth/[...nextauth]/route.ts`

- **POST `/api/auth/register`**: Registers a new user. It adds the individual to the internal `users` MongoDB collection, using `bcrypt` to hash their password, and concurrently attempts to sync the registration with an external .NET backend running at `localhost:5003`.
- **GET/POST `/api/auth/[...nextauth]`**: Standard NextAuth endpoints handling session management, sign-in, and sign-out according to the configuration in `@/lib/auth`.

### 3. Flutter (Mobile App) API
`src/app/api/flutter/apply_for_pg/route.ts` & `src/app/api/flutter/pgfetch/route.ts`

- **POST `/api/flutter/apply_for_pg`**: Submit a new PG application via the mobile app. Expects fields like `GuestId`, `PgId`, `FloorNumber`, etc., and creates a `PENDING` application.
- **GET `/api/flutter/pgfetch`**: Fetches a list of all PG listings specifically for consumption by the mobile app. Allows search queries through parameters such as `?city=...` and `?area=...`.

### 4. PG Listings API
`src/app/api/pg-listings/route.ts` & `src/app/api/pg-listings/[id]/route.ts`

- **GET `/api/pg-listings`**: Retrieves PG listings. It supports filtering by a specific owner using `?ownerId=...`.
- **POST `/api/pg-listings`**: Creates a new PG listing. Requires the user to be authenticated and hold a `PG_OWNER` role. Created properties are unverified (`IsVerified: false`) by default.
- **GET `/api/pg-listings/[id]`**: Retrieves details for a specific PG listing using its unique identifier. Returns `404` if the PG does not exist.

### 5. Media Upload API
`src/app/api/upload/route.ts`

- **POST `/api/upload`**: Uploads image files (maximum of 10 simultaneous uploads permitted). Images are processed, encoded in base64, and transferred to Cloudinary. References to these files and their metadata are subsequently saved in the MongoDB `media` collection.
