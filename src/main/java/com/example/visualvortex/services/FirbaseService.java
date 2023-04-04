package com.example.visualvortex.services;

import com.example.visualvortex.entities.Key;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class FirbaseService {
    public String Save(String ID)  {
        try {
            Firestore dbFirstore= FirestoreClient.getFirestore();
            Key k= Key.builder().ID(ID).build();
            DocumentReference docRef = dbFirstore.collection("key").document();
            docRef.set(k);
            docRef.get();
            String s= docRef.getId();
            return s;
        }catch (Exception exception)
        { System.out.println(exception);}

       return "";
    }

    public String get(String documentID) throws ExecutionException, InterruptedException {
        Firestore dbFirstore= FirestoreClient.getFirestore();
        DocumentReference documentReference=dbFirstore.collection("Key").document(documentID);
        ApiFuture<DocumentSnapshot> future=documentReference.get();
        DocumentSnapshot document=future.get();
        if(document.exists()) {
           Key m =document.toObject(Key.class);
            return m.getID();
        }
        return null;
    }
}
