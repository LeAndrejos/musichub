package com.musiclessonshub.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotEmpty;

@Component
@ConfigurationProperties(prefix = "security")
@Getter
@Setter
public class Salt {
    @NotEmpty
    private String salt;
}
