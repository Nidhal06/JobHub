package com.backend.jobhub.repository;

import com.backend.jobhub.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, String> {
    List<JobApplication> findByJobId(String jobId);
    List<JobApplication> findByCandidateIdOrderBySubmittedAtDesc(String candidateId);
    List<JobApplication> findByJobIdIn(List<String> jobIds);
    boolean existsByJobIdAndCandidateId(String jobId, String candidateId);
}
