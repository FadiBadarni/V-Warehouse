package com.example.visualvortex.services;

import com.example.visualvortex.entities.Schedule;
import com.example.visualvortex.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}