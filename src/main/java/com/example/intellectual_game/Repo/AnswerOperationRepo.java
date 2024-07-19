package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.AnswerOperation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerOperationRepo extends MongoRepository<AnswerOperation, String> {
}
