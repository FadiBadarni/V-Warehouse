//package com.example.visualvortex.Services;
//
//import com.example.visualvortex.dtos.ItemDTOS.ItemAttributeDTO;
//import com.example.visualvortex.dtos.ItemDTOS.InstanceDTO;
//import com.example.visualvortex.dtos.ItemDTOS.ItemTypeDTO;
//import com.example.visualvortex.dtos.ItemDTOS.itemDTO;
//import com.example.visualvortex.entities.Item.*;
//import com.example.visualvortex.repositories.ItemInstanceRepository;
//import com.example.visualvortex.repositories.ItemRepository;
//import com.example.visualvortex.repositories.ItemTypeRepository;
//import com.example.visualvortex.services.Item.ItemService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.*;
//
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//
//@ExtendWith(MockitoExtension.class)
//public class ItemServiceTest {
//
//    @InjectMocks
//    private ItemService itemService;
//
//    @Mock
//    private ItemRepository itemRepository;
//
//    @Mock
//    private ItemTypeRepository itemTypeRepository;
//
//    @Mock
//    private ItemInstanceRepository itemInstanceRepository;
//
//    private ItemType itemType;
//    private Item item;
//
//    @BeforeEach
//    void setUp() {
//        itemType = new ItemType();
//        itemType.setId(1L);
//        itemType.setName("Type1");
//
//        ItemAttribute attribute1 = new ItemAttribute("Color", "Red", itemType);
//        attribute1.setId(1L);
//        ItemAttribute attribute2 = new ItemAttribute("Size", "M", itemType);
//        attribute2.setId(2L);
//        itemType.setAttributes(Set.of(attribute1, attribute2));
//
//        ItemInstance itemInstance1 = new ItemInstance();
//        itemInstance1.setId(1L);
//        itemInstance1.setState(ItemState.AVAILABLE);
//        ItemInstance itemInstance2 = new ItemInstance();
//        itemInstance2.setId(2L);
//        itemInstance2.setState(ItemState.AVAILABLE);
//        List<ItemInstance> itemInstances = new ArrayList<>(List.of(itemInstance1, itemInstance2));
//
//        item = Item.builder()
//                .id(1L)
//                .name("Item1")
//                .description("Item1 description")
//                .itemType(itemType)
//                .itemInstances(itemInstances)
//                .build();
//
//        itemInstance1.setItem(item);
//        itemInstance2.setItem(item);
//    }
//
//
//    @Test
//    void testGetAllItems() {
//        when(itemRepository.findAll()).thenReturn(List.of(item));
//
//        List<Item> result = itemService.getAllItems();
//
//        assertEquals(1, result.size());
//        assertEquals(item, result.get(0));
//    }
//
//    @Test
//    void testGetItemById() {
//        when(itemRepository.findById(anyLong())).thenReturn(Optional.of(item));
//
//        Item result = itemService.getItemById(1L);
//
//        assertEquals(item, result);
//    }
//
//    @Test
//    void testGetItemById_NotFound() {
//        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());
//
//        assertThrows(ResponseStatusException.class, () -> itemService.getItemById(1L));
//    }
//
//    @Test
//    void testSaveItem() {
//        InstanceDTO itemDTO = new InstanceDTO();
//        itemDTO.setName("NewItem");
//        itemDTO.setDescription("NewItem description");
////        itemDTO.setQuantity(2);
//        ItemTypeDTO itemTypeDTO = new ItemTypeDTO();
//        itemTypeDTO.setName("Type1");
//        itemTypeDTO.setAttributes(Set.of(new ItemAttributeDTO(1L, "Color", "Red"),
//                new ItemAttributeDTO(2L, "Size", "M")));
//        itemDTO.setItemType(itemTypeDTO);
//
//        when(itemTypeRepository.findByName(anyString())).thenReturn(Optional.of(itemType));
//        when(itemRepository.findByNameAndItemTypeId(anyString(), anyLong())).thenReturn(Optional.empty());
//        when(itemRepository.save(any(Item.class))).thenReturn(item);
//        Item item1 = new Item();
//        item1.setId(1L);
//        ItemInstance itemInstance1 = new ItemInstance();
//        itemInstance1.setItem(item1);
//        itemInstance1.setId(1L);
//        itemInstance1.setState(ItemState.AVAILABLE);
//
//        Item item2 = new Item();
//        item2.setId(2L);
//        ItemInstance itemInstance2 = new ItemInstance();
//        itemInstance2.setItem(item2);
//        itemInstance2.setId(2L);
//        itemInstance2.setState(ItemState.AVAILABLE);
//
//        when(itemInstanceRepository.saveAll(anyList())).thenReturn(List.of(itemInstance1, itemInstance2));
//
////        List<ItemInstanceDTO> result = itemService.saveItem(itemDTO);
//
////        assertEquals(2, result.size());
//        verify(itemTypeRepository, times(1)).findByName(anyString());
//        verify(itemRepository, times(1)).findByNameAndItemTypeId(anyString(), anyLong());
//        verify(itemRepository, times(2)).save(any(Item.class));
//        verify(itemInstanceRepository, times(2)).saveAll(anyList());
//    }
//
//
//    @Test
//    void testGetItemNames() {
//        when(itemRepository.findAll()).thenReturn(List.of(item));
//
//        List<String> result = itemService.getItemNames();
//
//        assertEquals(1, result.size());
//        assertEquals(item.getName(), result.get(0));
//    }
//
//    @Test
//    void testGetItemByName() {
//        when(itemRepository.findByName(anyString())).thenReturn(Optional.of(item));
//
//        itemDTO result = itemService.getItemByName(item.getName());
//
//        assertEquals(item.getId(), result.getId());
//        assertEquals(item.getName(), result.getName());
//        assertEquals(item.getDescription(), result.getDescription());
//    }
//
//    @Test
//    void testGetItemByName_NotFound() {
//        when(itemRepository.findByName(anyString())).thenReturn(Optional.empty());
//
//        assertThrows(NoSuchElementException.class, () -> itemService.getItemByName("NotExistingItem"));
//    }
//}