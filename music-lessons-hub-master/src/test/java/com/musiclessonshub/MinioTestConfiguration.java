package com.musiclessonshub;

import com.musiclessonshub.minio.MusicHubMinioClient;
import org.springframework.context.annotation.Configuration;

import static org.mockito.Mockito.mock;

@Configuration
public class MinioTestConfiguration {

    public MusicHubMinioClient lexMinioClient() {
        return mock(MusicHubMinioClient.class);
    }
}
