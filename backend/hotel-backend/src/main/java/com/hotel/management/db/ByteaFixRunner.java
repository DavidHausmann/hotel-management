package com.hotel.management.db;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.nio.charset.StandardCharsets;

/**
 * Runs an idempotent SQL script to convert possible bytea columns to text when
 * the property `app.applyByteaFix=true` is set. This allows applying the
 * non-destructive migration without external tools.
 */
@Component
@Order(1)
public class ByteaFixRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ByteaFixRunner.class);

    private final Environment env;
    private final DataSource dataSource;

    public ByteaFixRunner(Environment env, DataSource dataSource) {
        this.env = env;
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        boolean apply = Boolean.parseBoolean(env.getProperty("app.applyByteaFix", "false"));
        // also accept environment variable APPLY_BYTEA_FIX=true for convenience
        if (!apply) {
            String envFlag = System.getenv("APPLY_BYTEA_FIX");
            apply = "true".equalsIgnoreCase(envFlag) || "1".equals(envFlag);
        }
        if (!apply) {
            return;
        }

        log.info("app.applyByteaFix=true — executing bytea->text migration script from classpath");
        ClassPathResource resource = new ClassPathResource("db/migration/V1__convert_hotel_guest_bytea_to_text.sql");
        if (!resource.exists()) {
            log.warn("Migration script not found on classpath: {}", resource.getPath());
            return;
        }

        try (Connection conn = dataSource.getConnection()) {
            // Log current column types for visibility
            try (var ps = conn.prepareStatement(
                    "SELECT table_schema, column_name, data_type FROM information_schema.columns WHERE table_name = 'hotel_guest' AND column_name IN ('name','document','phone') ORDER BY table_schema");
                    var rs = ps.executeQuery()) {
                while (rs.next()) {
                    String col = rs.getString("column_name");
                    String dt = rs.getString("data_type");
                    log.info("hotel_guest.{} has data_type={}", col, dt);
                }
            } catch (Exception error) {
                log.warn("Could not read current column types", error);
            }

            String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            try (Statement st = conn.createStatement()) {
                st.execute(sql);
            }

            // Log column types after attempting conversion
            try (var ps2 = conn.prepareStatement(
                    "SELECT table_schema, column_name, data_type FROM information_schema.columns WHERE table_name = 'hotel_guest' AND column_name IN ('name','document','phone') ORDER BY table_schema");
                    var rs2 = ps2.executeQuery()) {
                while (rs2.next()) {
                    String col = rs2.getString("column_name");
                    String dt = rs2.getString("data_type");
                    String schema = rs2.getString("table_schema");
                    log.info("after-migration: hotel_guest (schema={}).{} has data_type={}", schema, col, dt);
                }
            } catch (Exception error) {
                log.warn("Could not read post-migration column types", error);
            }

            log.info("Bytea->text migration script executed (if any conversion was needed).");
            // quick runtime test: try selecting lower(name) to see if DB still complains
            try (var ps3 = conn.prepareStatement("SELECT lower(name) FROM hotel_guest LIMIT 1");
                    var rs3 = ps3.executeQuery()) {
                if (rs3.next()) {
                    log.info("runtime-test: lower(name) succeeded");
                } else {
                    log.info("runtime-test: no rows to test lower(name)");
                }
            } catch (Exception error) {
                log.error("runtime-test: selecting lower(name) failed", error);
            }
        } catch (Exception error) {
            log.error("Failed to execute migration script", error);
            throw error;
        }
    }
}
