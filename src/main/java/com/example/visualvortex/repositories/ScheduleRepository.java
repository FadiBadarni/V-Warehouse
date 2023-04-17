package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.ItemInstance;
import com.example.visualvortex.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByItemInstanceId(long id);

    List<Schedule> findByItemInstanceId(Long itemInstanceId);
    List<Schedule> findByItemInstanceIdIn(List<Long> itemInstanceIds);

    List<Schedule>  findByItemInstance(ItemInstance instance);

    @Query("SELECT s FROM Schedule s WHERE s.itemType.id= :itemType")
    List<Schedule> findByItemTypeId(@Param("itemType") long itemType);



}
