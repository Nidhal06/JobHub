package com.backend.jobhub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateApplicationRequest {
    @NotBlank(message = "Job ID is required")
    private String jobId;
    
    private String linkedinUrl;
    
    private String githubUrl;
    
    private String coverLetter;
    
    private List<UploadedDocumentDTO> attachments;
}
