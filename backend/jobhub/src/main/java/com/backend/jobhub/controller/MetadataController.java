package com.backend.jobhub.controller;

import com.backend.jobhub.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MetadataController {
    
    private final JobService jobService;
    
    @GetMapping("/industries")
    public ResponseEntity<List<String>> getIndustries() {
        return ResponseEntity.ok(jobService.getIndustries());
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getTags() {
        return ResponseEntity.ok(jobService.getTags());
    }
}
