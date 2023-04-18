package com.example.visualvortex.services;

import com.example.visualvortex.entities.Key;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
public class FirebaseService {

    public Optional<String> save(String id) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            Key key = Key.builder().ID(id).build();
            DocumentReference docRef = dbFirestore.collection("key").document();
            docRef.set(key).get();
            return Optional.of(docRef.getId());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving document in Firestore", e);
        }
        return Optional.empty();
    }

    public Optional<String> get(String documentId) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = dbFirestore.collection("Key").document(documentId);
            ApiFuture<DocumentSnapshot> future = documentReference.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                Key key = document.toObject(Key.class);
                return Optional.ofNullable(key.getID());
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error retrieving document from Firestore", e);
        }
        return Optional.empty();
    }
}