package com.mediconnect.controller;

import com.mediconnect.model.Document;
import com.mediconnect.model.User;
import com.mediconnect.repository.DocumentRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

    public FileController(DocumentRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                         @RequestParam(value = "category", required = false) String category,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User patient = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Files.createDirectories(UPLOAD_DIR);

            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String storedName = UUID.randomUUID() + ext;
            Path targetPath = UPLOAD_DIR.resolve(storedName);
            file.transferTo(targetPath.toFile());

            Document doc = Document.builder()
                    .patient(patient)
                    .fileName(originalName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(storedName)
                    .category(category)
                    .build();
            documentRepository.save(doc);

            return ResponseEntity.ok(Map.of(
                    "id", doc.getId(),
                    "fileName", doc.getFileName(),
                    "fileType", doc.getFileType(),
                    "fileSize", doc.getFileSize(),
                    "category", doc.getCategory(),
                    "uploadedAt", doc.getUploadedAt()
            ));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        var opt = documentRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Document doc = opt.get();
        Path filePath = UPLOAD_DIR.resolve(doc.getStoragePath());
        Resource resource = new FileSystemResource(filePath.toFile());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        var opt = documentRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Document doc = opt.get();
        User patient = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!doc.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }
        try {
            Files.deleteIfExists(UPLOAD_DIR.resolve(doc.getStoragePath()));
        } catch (IOException ignored) {}
        documentRepository.delete(doc);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyFiles(@AuthenticationPrincipal UserDetails userDetails) {
        User patient = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Document> docs = documentRepository.findByPatientOrderByUploadedAtDesc(patient);
        List<Map<String, Object>> result = docs.stream().map(doc -> Map.<String, Object>of(
                "id", doc.getId(),
                "fileName", doc.getFileName(),
                "fileType", doc.getFileType(),
                "fileSize", doc.getFileSize(),
                "category", doc.getCategory() != null ? doc.getCategory() : "",
                "uploadedAt", doc.getUploadedAt()
        )).toList();
        return ResponseEntity.ok(result);
    }
}
