package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepo extends MongoRepository<Question, String> {
    List<Question> findBySubjectIn(List<String> subjects);


}
