package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepo extends MongoRepository<Subject, String> {
}
