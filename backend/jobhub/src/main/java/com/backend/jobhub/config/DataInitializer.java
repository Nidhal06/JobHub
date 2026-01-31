package com.backend.jobhub.config;

import com.backend.jobhub.entity.*;
import com.backend.jobhub.repository.JobRepository;
import com.backend.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        initializeUsers();
        initializeJobs();
    }
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing seed users...");
            
            User admin = User.builder()
                    .name("Nidhal Gharbi")
                    .email("admin@jobhub.com")
                    .password(passwordEncoder.encode("DemoAdmin123"))
                    .role(UserRole.admin)
                    .title("Platform Administrator")
                    .build();
            
            User recruiter = User.builder()
                    .name("RH Manager")
                    .email("recruiter@jobhub.com")
                    .password(passwordEncoder.encode("DemoRecruiter123"))
                    .role(UserRole.recruiter)
                    .company("FutureTech Labs")
                    .title("Lead Recruiter")
                    .build();
            
            User seeker = User.builder()
                    .name("User Seeker")
                    .email("seeker@jobhub.com")
                    .password(passwordEncoder.encode("DemoSeeker123"))
                    .role(UserRole.seeker)
                    .title("Product Designer")
                    .build();
            
            userRepository.saveAll(Arrays.asList(admin, recruiter, seeker));
            log.info("Seed users created successfully");
        }
    }
    
    private void initializeJobs() {
        if (jobRepository.count() == 0) {
            log.info("Initializing seed jobs...");
            
            User recruiter = userRepository.findByEmail("recruiter@jobhub.com").orElse(null);
            String recruiterId = recruiter != null ? recruiter.getId() : "recruiter-1";
            
            Job job1 = Job.builder()
                    .title("Senior Frontend Engineer")
                    .company("FutureTech Labs")
                    .location("Tunis, Tunisia")
                    .salary("35,000 - 45,000 TND/year")
                    .type(JobType.FULL_TIME)
                    .industry("Technology")
                    .experienceLevel(ExperienceLevel.senior)
                    .status(JobStatus.approved)
                    .description("Work closely with product and design teams to deliver high-quality web experiences for our SaaS platform.")
                    .requirements(List.of(
                            "7+ years of professional frontend experience",
                            "Expert knowledge of Angular and TypeScript",
                            "Experience with design systems and component libraries",
                            "Strong understanding of accessibility and performance"
                    ))
                    .responsibilities(List.of(
                            "Own complex frontend initiatives end-to-end",
                            "Mentor engineers and enforce coding standards",
                            "Collaborate with cross-functional partners",
                            "Drive experimentation and data-informed UI improvements"
                    ))
                    .tags(List.of("Angular", "Leadership"))
                    .createdBy(recruiterId)
                    .applications(12)
                    .build();
            
            Job job2 = Job.builder()
                    .title("Product Designer")
                    .company("Orbit Commerce")
                    .location("Sfax, Tunisia")
                    .salary("25,000 - 32,000 TND/year")
                    .type(JobType.FULL_TIME)
                    .industry("E-commerce")
                    .experienceLevel(ExperienceLevel.mid)
                    .status(JobStatus.pending)
                    .description("Design end-to-end experiences that help millions of merchants manage their digital storefronts.")
                    .requirements(List.of(
                            "Portfolio demonstrating shipped product work",
                            "Comfortable with Figma and prototyping tools",
                            "Experience collaborating with research and engineering",
                            "Understanding of design systems"
                    ))
                    .responsibilities(List.of(
                            "Translate insights into intuitive flows",
                            "Maintain and evolve design system",
                            "Run workshops with stakeholders",
                            "Partner with engineers on implementation details"
                    ))
                    .tags(List.of("UX", "UI"))
                    .createdBy("recruiter-2")
                    .applications(7)
                    .build();
            
            Job job3 = Job.builder()
                    .title("Data Analyst (Contract)")
                    .company("Insight Analytics")
                    .location("Sousse, Tunisia")
                    .salary("30 - 35 TND/hour")
                    .type(JobType.CONTRACT)
                    .industry("Analytics")
                    .experienceLevel(ExperienceLevel.mid)
                    .status(JobStatus.approved)
                    .description("Enable data-informed decisions by building visualizations and uncovering actionable insights.")
                    .requirements(List.of(
                            "Strong SQL and dashboarding experience",
                            "Comfort with Python or R",
                            "Background in experimentation and A/B testing",
                            "Excellent communication skills"
                    ))
                    .responsibilities(List.of(
                            "Partner with product teams to define metrics",
                            "Develop dashboards that support business objectives",
                            "Maintain data quality through monitoring",
                            "Support go-to-market reporting needs"
                    ))
                    .tags(List.of("SQL", "Analytics"))
                    .createdBy(recruiterId)
                    .applications(4)
                    .build();
            
            Job job4 = Job.builder()
                    .title("DevOps Engineer")
                    .company("CloudOps Solutions")
                    .location("Tunis, Tunisia")
                    .salary("30,000 - 40,000 TND/year")
                    .type(JobType.FULL_TIME)
                    .industry("Cloud & Infrastructure")
                    .experienceLevel(ExperienceLevel.senior)
                    .status(JobStatus.approved)
                    .description("Build and maintain scalable cloud infrastructure while ensuring high availability and security.")
                    .requirements(List.of(
                            "3+ years of experience with AWS, Azure, or GCP",
                            "Proficiency in CI/CD pipelines and automation tools",
                            "Strong scripting skills (Python, Bash, etc.)",
                            "Experience with monitoring and logging systems"
                    ))
                    .responsibilities(List.of(
                            "Design and manage cloud architecture",
                            "Automate deployments and infrastructure tasks",
                            "Ensure system security and compliance",
                            "Collaborate with development teams to optimize performance"
                    ))
                    .tags(List.of("DevOps", "Cloud", "Automation"))
                    .createdBy("recruiter-3")
                    .applications(5)
                    .build();
            
            jobRepository.saveAll(Arrays.asList(job1, job2, job3, job4));
            log.info("Seed jobs created successfully");
        }
    }
}
