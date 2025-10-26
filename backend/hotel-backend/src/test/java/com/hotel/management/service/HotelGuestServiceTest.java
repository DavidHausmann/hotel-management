package com.hotel.management.service;

import com.hotel.management.dto.HotelGuestPatchRequest;
import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

public class HotelGuestServiceTest {

    @Mock
    private HotelGuestRepository repository;

    private HotelGuestService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        service = new HotelGuestService(repository);
    }

    @Test
    void patch_should_update_only_non_null_fields() {
        HotelGuest existing = new HotelGuest();
        existing.setId(1L);
        existing.setName("Old Name");
        existing.setDocument("111.111.111-11");
        existing.setPhone("(11)99999-9999");
        existing.setHasCar(false);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        HotelGuestPatchRequest req = new HotelGuestPatchRequest();
        req.setName("New Name");
        // leave other fields null

        HotelGuest result = service.patch(1L, req);

        ArgumentCaptor<HotelGuest> captor = ArgumentCaptor.forClass(HotelGuest.class);
        verify(repository).save(captor.capture());

        HotelGuest saved = captor.getValue();
        assertThat(saved.getName()).isEqualTo("New Name");
        assertThat(saved.getDocument()).isEqualTo("111.111.111-11");
        assertThat(saved.getPhone()).isEqualTo("(11)99999-9999");
        assertThat(saved.isHasCar()).isFalse();

        assertThat(result).isSameAs(existing);
    }

    @Test
    void patch_should_throw_when_not_found() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        HotelGuestPatchRequest req = new HotelGuestPatchRequest();

        assertThrows(IllegalArgumentException.class, () -> service.patch(99L, req));
    }
}
