package com.example.visualvortex.dtos.ItemDTOS;


import lombok.Builder;

import java.util.List;
@Builder
public class AvailableInstanceQuantity {
   private   int  pendingQuantity;
   private  int  availableQuantity;
   private  List<Long> availableItemsIds;

   public  AvailableInstanceQuantity(int pendingQuantity,int availableQuantity,List<Long> availableItemsIds )
   {
       this.availableItemsIds=availableItemsIds;
       this.availableQuantity=availableQuantity;
       this.pendingQuantity=pendingQuantity;
   }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public List<Long> getAvailableItemsIds() {
        return availableItemsIds;
    }

    public void setAvailableItemsIds(List<Long> availableItemsIds) {
        this.availableItemsIds = availableItemsIds;
    }

    public int getPendingQuantity() {
        return pendingQuantity;
    }

    public void setPendingQuantity(int pendingQuantity) {
        this.pendingQuantity = pendingQuantity;
    }
}
