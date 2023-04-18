package com.example.visualvortex.repositories;

import com.example.visualvortex.entities.Item.ItemInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface ItemInstanceRepository extends JpaRepository<ItemInstance, Long> {
    @Query("SELECT COUNT(*) FROM ItemInstance WHERE item.id = ?1")
    int quantityItemsBy(Long id);
    List<ItemInstance> findAllByItemId(Long itemId);

    @Query(value = "SELECT COUNT(*) FROM item_instances WHERE item_id = ?1 AND id NOT IN (SELECT item_instance_id FROM schedule WHERE intended_return_date >= ?2 AND intended_start_date <= ?3)", nativeQuery = true)
    int countItemInstancesByItemIdAndIntendedDates(Long itemId, Date intendedStartDate, Date intendedReturnDate);

    @Query(value = "SELECT COUNT(*) FROM item_instances WHERE item_id = ?1", nativeQuery = true)
    int countItemInstancesByItemId(Long itemId);


    @Query(value = "SELECT tabel1.id, tabel1.startDate, tabel1.returnDate " +
            "FROM (SELECT item_instances.id as id, schedule.intended_start_date as startDate, item_id as item, intended_return_date as returnDate " +
            "FROM item_instances INNER JOIN schedule ON item_instances.id = schedule.item_instance_id) as tabel1 " +
            "WHERE item = ?1 AND id NOT IN (SELECT item_instance_id FROM schedule WHERE (intended_start_date < ?2 AND intended_return_date > ?3))", nativeQuery = true)
    List<Object[]> findItemInstancesByItemIdAndDate(long itemId, LocalDate date,LocalDate date2);



}
