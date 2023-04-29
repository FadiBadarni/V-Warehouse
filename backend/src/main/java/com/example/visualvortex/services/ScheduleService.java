package com.example.visualvortex.services;

import com.example.visualvortex.entities.Schedule;
import com.example.visualvortex.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public List<Schedule> findAll() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> findById(Long id) {
        return scheduleRepository.findById(id);
    }

    public Schedule save(Schedule itemInstanceSchedule) {
        return scheduleRepository.save(itemInstanceSchedule);
    }

    public void deleteById(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<Long> getScheduleItemInstanceIds(Long itemId, String startDate, String returnDate) {
        LocalDateTime startDateO=LocalDateTime.parse(startDate,DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime returnDateO=LocalDateTime.parse(returnDate,DateTimeFormatter.ISO_DATE_TIME);
        List<Schedule> scheduleList=scheduleRepository.findAll();

        List<Long> x=new ArrayList<>();
        for (Schedule s:scheduleList) {
            if(s.getItemType().getId() == itemId)
            if(s.getIntendedReturnDate().isEqual(returnDateO))
                if(s.getIntendedStartDate().equals(startDateO))
                    x.add(s.getItemInstance().getId());
        }
        return  x;
    }
}