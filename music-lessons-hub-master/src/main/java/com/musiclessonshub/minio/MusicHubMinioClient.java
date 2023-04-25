package com.musiclessonshub.minio;

import com.musiclessonshub.propertie.MinioProperties;
import io.minio.MinioClient;
import io.minio.ObjectStat;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.HashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class MusicHubMinioClient {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @PostConstruct
    @SneakyThrows //TODO handle it in human way
    public void init() {
        if (!minioClient.bucketExists(minioProperties.getLessonsBucket())) {
            log.debug("Creating new bucket {}", minioProperties.getLessonsBucket());
            minioClient.makeBucket(minioProperties.getLessonsBucket());
        }
    }

    @SneakyThrows
    public void uploadFile(MultipartFile file, String filename) {
        minioClient.putObject(
                minioProperties.getLessonsBucket(),
                filename,
                file.getInputStream(),
                file.getSize(),
                new HashMap<>(),
                null,
                file.getContentType()
        );
    }

    public long getObjectStat(String fileId) throws Exception{
        return minioClient.statObject(minioProperties.getLessonsBucket(), fileId).length();
    }

    public InputStream getFileContent(String fileId) throws Exception {
        return minioClient.getObject(minioProperties.getLessonsBucket(), fileId);
    }

    @SneakyThrows
    public void deleteFile(String fileId) {
        minioClient.removeObject(minioProperties.getLessonsBucket(), fileId);
    }

}
