package com.example.cloudinary.file;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryStorageService {

    private final Cloudinary cloudinary;

    public Map<String, Object> upload(MultipartFile file, String folder, String resourceType)
            throws IOException {
        return cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", resourceType,
                        "use_filename", true,
                        "unique_filename", true,
                        "overwrite", false
                )
        );
    }

    public void delete(String publicId, String resourceType) throws IOException {
        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap(
                        "resource_type", resourceType,
                        "invalidate", true
                )
        );
    }
}
