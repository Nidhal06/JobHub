package com.backend.jobhub.repository;

import com.backend.jobhub.entity.Job;
import com.backend.jobhub.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByCreatedBy(String createdBy);
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);
    List<Job> findAllByOrderByCreatedAtDesc();
}
