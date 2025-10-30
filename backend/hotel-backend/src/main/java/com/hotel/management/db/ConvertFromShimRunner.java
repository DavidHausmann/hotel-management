package com.hotel.management.db;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
@Order(0)
public class ConvertFromShimRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ConvertFromShimRunner.class);

    private final DataSource dataSource;

    public ConvertFromShimRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection conn = dataSource.getConnection(); Statement st = conn.createStatement()) {
            String sql = "CREATE OR REPLACE FUNCTION convert_from(text, text) RETURNS text AS $$ SELECT $1; $$ LANGUAGE SQL IMMUTABLE;";
            st.execute(sql);
            log.info("Ensured shim function convert_from(text, text) exists");
        } catch (Exception e) {
            log.warn("Could not ensure convert_from(text,text) shim function: {}", e.getMessage());
        }
    }
}
