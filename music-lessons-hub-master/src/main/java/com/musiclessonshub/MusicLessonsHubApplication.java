package com.musiclessonshub;

import com.musiclessonshub.controller.FileController;
import com.musiclessonshub.propertie.MinioProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(MinioProperties.class)
@SpringBootApplication
public class MusicLessonsHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicLessonsHubApplication.class, args);
	}

}
