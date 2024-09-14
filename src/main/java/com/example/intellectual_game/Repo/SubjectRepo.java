package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepo extends MongoRepository<Subject, String> {
    List<Subject> findByNameIn(List<String> names);
}
