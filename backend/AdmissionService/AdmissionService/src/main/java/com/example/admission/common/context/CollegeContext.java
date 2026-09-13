package com.example.admission.common.context;

import java.util.UUID;

public final class CollegeContext {
    private static final ThreadLocal<UUID> ID = new ThreadLocal<>();

    private CollegeContext() {
    }

    public static UUID getCollegeId() {
        return ID.get();
    }

    public static void setCollegeId(UUID id) {
        ID.set(id);
    }

    public static void clear() {
        ID.remove();
    }
}
