package com.example.fee.common.context;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Getter
@Setter
@Component
public class CollegeContext {

    private static final ThreadLocal<UUID> COLLEGE_ID = new ThreadLocal<>();

    public static UUID getCollegeId() {
        return COLLEGE_ID.get();
    }

    public static void setCollegeId(UUID id) {
        COLLEGE_ID.set(id);
    }

    public static void clear() {
        COLLEGE_ID.remove();
    }
}