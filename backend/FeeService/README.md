# Fee Service

Port: 8085
Database: feedb on localhost:4409

## Important design
- `StudentFee.id` identifies the student's fee account.
- `FeePayment` uses `studentUserId` to associate a payment with the student; it intentionally does NOT contain `feeId` or `formWindowId`.
- `FeeFormWindow` only controls when a student is allowed to submit a payment form.
- `transactionIds` is one comma-separated String.
- `proofImages` is a list of image URLs/paths. Store actual files in object/file storage later; keep only references in MySQL.
- Student identity and college are taken from JWT contexts, never from request body.

## Run
1. Create the `mysql-fee` container/database in your compose file (port 4409 -> 3306, database `feedb`, root/root).
2. Start MySQL.
3. Run `mvn spring-boot:run`.

## Gateway route
Add:
- id: fee-service
  uri: http://localhost:8085
  predicates:
    - Path=/api/v1/fee/**
