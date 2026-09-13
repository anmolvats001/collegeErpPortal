package com.CoreService.CoreService.common.context;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.UUID;
@Getter
@Setter
@Component
public class CollegeContext {

    private static final ThreadLocal<UUID> collegeId = new ThreadLocal<>();

    public static UUID getCollegeId() {
        return collegeId.get();
    }

    public static void setCollegeId(UUID id) {
        collegeId.set(id);
    }

    public static void clear() {
        collegeId.remove();
    }
}
