package com.CoreService.CoreService.common.context;

import lombok.*;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserContext {

    private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<UUID> COLLEGE_ID = new ThreadLocal<>();

    public static void setUserId(String userId) {
        USER_ID.set(userId);
    }

    public static String getUserId() {
        return USER_ID.get();
    }

    public static void setCollegeId(UUID collegeId) {
        COLLEGE_ID.set(collegeId);
    }

    public static UUID getCollegeId() {
        return COLLEGE_ID.get();
    }

    public static void clear() {
        USER_ID.remove();
        COLLEGE_ID.remove();
    }
}