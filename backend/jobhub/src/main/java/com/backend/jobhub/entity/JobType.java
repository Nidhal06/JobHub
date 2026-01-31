package com.backend.jobhub.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum JobType {
    FULL_TIME("full-time"),
    PART_TIME("part-time"),
    CONTRACT("contract"),
    FREELANCE("freelance"),
    INTERNSHIP("internship");
    
    private final String value;
    
    JobType(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    public static JobType fromValue(String value) {
        for (JobType type : JobType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown job type: " + value);
    }
}
