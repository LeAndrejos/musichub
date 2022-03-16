package com.musiclessonshub.propertie;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotEmpty;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "minio")
public class MinioProperties {
    @NotEmpty
    private String url;
    @NotEmpty
    private String accessKey;
    @NotEmpty
    private String secretKey;
    @NotEmpty
    private String lessonsBucket;
}
