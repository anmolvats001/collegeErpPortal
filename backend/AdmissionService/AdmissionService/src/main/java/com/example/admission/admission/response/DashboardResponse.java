package com.example.admission.admission.response;

import lombok.*;

@Getter
@Builder
public class DashboardResponse {
    private long totalApplications, submitted, underReview, approved, rejected;
}
