package com.backend.jobhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadedDocumentDTO {
    private String id;
    private String name;
    private long size;
    private String type;
    private String content; // Base64 encoded file content (optional, only when uploading)
}
