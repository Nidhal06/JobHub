package com.backend.jobhub.dto;

import com.backend.jobhub.entity.ExperienceLevel;
import com.backend.jobhub.entity.JobStatus;
import com.backend.jobhub.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private String id;
    private String title;
    private String company;
    private String location;
    private String salary;
    private JobType type;
    private String industry;
    private ExperienceLevel experienceLevel;
    private JobStatus status;
    private String description;
    private List<String> requirements;
    private List<String> responsibilities;
    private String createdAt;
    private String createdBy;
    private int applications;
    private String lastUpdatedBy;
    private List<String> tags;
}
