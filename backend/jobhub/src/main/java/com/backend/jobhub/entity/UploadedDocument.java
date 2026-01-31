package com.backend.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "uploaded_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadedDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private long size;
    
    private String type;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // Base64 encoded file content
}
