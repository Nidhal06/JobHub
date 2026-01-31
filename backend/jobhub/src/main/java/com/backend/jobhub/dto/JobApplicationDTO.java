package com.backend.jobhub.dto;

import com.backend.jobhub.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDTO {
    private String id;
    private String jobId;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String linkedinUrl;
    private String githubUrl;
    private String coverLetter;
    private String submittedAt;
    private ApplicationStatus status;
    private List<UploadedDocumentDTO> attachments;
}
