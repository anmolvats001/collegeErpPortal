# CloudinaryService

Standalone file-storage microservice for MultiCollegeERP.

## Runtime ports

- HTTP: `8087`
- MySQL host port: `4410`
- Kafka: `9092`

These avoid the existing FeeService ports (`8085` and `4409`).

## Responsibilities

- Upload files to Cloudinary.
- Store file metadata in MySQL.
- Return the Cloudinary secure URL.
- List files by owner or entity.
- Delete files from Cloudinary and metadata from MySQL.
- Publish a `FILE_UPLOADED` JSON event to Kafka topic `file-events` for the future AI service.

## Run

Set these environment variables before starting:

`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`

The project uses the same Spring Boot `4.1.0` line as the existing services and uses `org.springframework.kafka:spring-kafka` directly, matching the current project convention.

## API

### Health

`GET /api/files/health`

### Upload

`POST /api/files/upload`

`multipart/form-data`

Required:
- `file`

Optional:
- `folder`
- `resourceType` (`auto`, `image`, `video`, `raw`)
- `ownerId`
- `entityType`
- `entityId`

### Get metadata

`GET /api/files/{id}`

### List by entity

`GET /api/files?entityType=ADMISSION&entityId=123`

### List by owner

`GET /api/files?ownerId=student-123`

### Delete

`DELETE /api/files/{id}`

## Kafka event

Topic: `file-events`

Event type: `FILE_UPLOADED`

The event contains only JSON data. Cloudinary Java package/type headers are disabled, so future AI services can consume it using their own DTO.

## Database

The service creates/updates the `file_metadata` table using JPA `ddl-auto=update`.
