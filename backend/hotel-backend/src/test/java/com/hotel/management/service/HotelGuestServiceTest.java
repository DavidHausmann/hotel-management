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
    @Mock
    private com.hotel.management.repository.HotelStayRepository stayRepository;

    private HotelGuestService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        service = new HotelGuestService(repository, stayRepository);
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

        assertThrows(com.hotel.management.exception.ResourceNotFoundException.class, () -> service.patch(99L, req));
    }

    @Test
    void delete_should_throw_conflict_when_guest_checked_in() {
        HotelGuest g = new HotelGuest();
        g.setId(5L);
        when(repository.findById(5L)).thenReturn(Optional.of(g));
        when(stayRepository.countByHotelGuest_IdAndStatus(5L, com.hotel.management.model.HotelStayStatus.CHECKED_IN))
                .thenReturn(1L);

        org.junit.jupiter.api.Assertions.assertThrows(com.hotel.management.exception.ResourceConflictException.class,
                () -> service.deleteById(5L));
    }

    @Test
    void delete_should_remove_reserved_stays_and_guest_when_no_checked_in() {
        HotelGuest g = new HotelGuest();
        g.setId(7L);
        when(repository.findById(7L)).thenReturn(Optional.of(g));
        when(stayRepository.countByHotelGuest_IdAndStatus(7L, com.hotel.management.model.HotelStayStatus.CHECKED_IN))
                .thenReturn(0L);

        com.hotel.management.model.HotelStay stay = new com.hotel.management.model.HotelStay();
        stay.setId(101L);
        when(stayRepository.findByHotelGuest_IdAndStatus(7L, com.hotel.management.model.HotelStayStatus.RESERVED))
                .thenReturn(java.util.List.of(stay));

        
        service.deleteById(7L);

        
        org.mockito.Mockito.verify(stayRepository).deleteAll(org.mockito.ArgumentMatchers.eq(java.util.List.of(stay)));
        org.mockito.Mockito.verify(repository).deleteById(7L);
    }
}
