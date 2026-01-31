package com.backend.jobhub.dto;

import com.backend.jobhub.entity.ExperienceLevel;
import com.backend.jobhub.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Company is required")
    private String company;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String salary;
    
    @NotNull(message = "Job type is required")
    private JobType type;
    
    private String industry;
    
    private ExperienceLevel experienceLevel;
    
    private String description;
    
    private List<String> requirements;
    
    private List<String> responsibilities;
    
    private List<String> tags;
}
