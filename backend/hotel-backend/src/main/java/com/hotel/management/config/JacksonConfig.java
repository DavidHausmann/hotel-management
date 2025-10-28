package com.hotel.management.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.data.domain.PageImpl;

/**
 * Configure Jackson so that Spring Data's PageImpl can be serialized safely by
 * ignoring internal properties that are not serializable in some environments
 * (for example: pageable, sort). Tests previously added a test-only mixin;
 * this registers the mixin globally so controllers returning Page<T> work at
 * runtime and do not trigger HttpMessageNotWritableException.
 */
@Configuration
public class JacksonConfig {

    @JsonIgnoreProperties({ "pageable", "sort" })
    private static abstract class PageImplMixin {
    }

    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.build();
        mapper.addMixIn(PageImpl.class, PageImplMixin.class);
        return mapper;
    }
}
