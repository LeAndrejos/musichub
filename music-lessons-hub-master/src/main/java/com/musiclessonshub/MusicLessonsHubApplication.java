package com.musiclessonshub;

import com.musiclessonshub.controller.FileController;
import com.musiclessonshub.propertie.MinioProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.jdbc.DatabaseDriver;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.support.DatabaseStartupValidator;

import javax.sql.DataSource;

@EnableConfigurationProperties(MinioProperties.class)
@SpringBootApplication
public class MusicLessonsHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicLessonsHubApplication.class, args);
	}

	@Bean
	public DatabaseStartupValidator databaseStartupValidator(DataSource dataSource) {
		DatabaseStartupValidator dsv = new DatabaseStartupValidator();
		dsv.setDataSource(dataSource);
		dsv.setInterval(60);
		dsv.setTimeout(720);
		//dsv.setValidationQuery(DatabaseDriver.POSTGRESQL.getValidationQuery());
		return dsv;
	}

}
