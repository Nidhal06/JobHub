package com.backend.jobhub.service;

import com.backend.jobhub.dto.CreateJobRequest;
import com.backend.jobhub.dto.JobDTO;
import com.backend.jobhub.entity.Job;
import com.backend.jobhub.entity.JobStatus;
import com.backend.jobhub.entity.User;
import com.backend.jobhub.exception.ResourceNotFoundException;
import com.backend.jobhub.repository.JobRepository;
import com.backend.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    
    public List<JobDTO> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JobDTO> getApprovedJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.approved)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JobDTO> getPendingJobs() {
        return jobRepository.findByStatus(JobStatus.pending)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<JobDTO> getRecruiterJobs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return jobRepository.findByCreatedBy(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public JobDTO getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return mapToDTO(job);
    }
    
    public JobDTO createJob(CreateJobRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .salary(request.getSalary())
                .type(request.getType())
                .industry(request.getIndustry())
                .experienceLevel(request.getExperienceLevel())
                .status(JobStatus.pending)
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .responsibilities(request.getResponsibilities())
                .tags(request.getTags())
                .createdBy(user.getId())
                .applications(0)
                .build();
        
        job = jobRepository.save(job);
        return mapToDTO(job);
    }
    
    public JobDTO updateJobStatus(String jobId, JobStatus status, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        job.setStatus(status);
        job.setLastUpdatedBy(user.getId());
        
        job = jobRepository.save(job);
        return mapToDTO(job);
    }
    
    public void incrementApplicationCount(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        job.setApplications(job.getApplications() + 1);
        jobRepository.save(job);
    }
    
    public List<String> getIndustries() {
        return jobRepository.findAll()
                .stream()
                .map(Job::getIndustry)
                .filter(industry -> industry != null && !industry.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    public List<String> getTags() {
        return jobRepository.findAll()
                .stream()
                .flatMap(job -> job.getTags() != null ? job.getTags().stream() : java.util.stream.Stream.empty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    private JobDTO mapToDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .salary(job.getSalary())
                .type(job.getType())
                .industry(job.getIndustry())
                .experienceLevel(job.getExperienceLevel())
                .status(job.getStatus())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .createdAt(job.getCreatedAt() != null ? job.getCreatedAt().toString() : null)
                .createdBy(job.getCreatedBy())
                .applications(job.getApplications())
                .lastUpdatedBy(job.getLastUpdatedBy())
                .tags(job.getTags())
                .build();
    }
}
