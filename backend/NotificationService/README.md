# Notification Service

Port: 8086

Consumes `notification-events` from Kafka and sends email using the
recipient email stored in the Kafka `email` header.

Kafka value:
{
  "subject": "Fee Payment Approved",
  "message": "Your fee payment has been approved."
}

Kafka header:
email = student@gmail.com

Environment variables:
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password

Run:
mvn clean install
mvn spring-boot:run

Health:
GET http://localhost:8086/api/notifications/health
