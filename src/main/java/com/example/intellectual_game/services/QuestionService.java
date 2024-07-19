package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Question;
import com.example.intellectual_game.Repo.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepo repository;

    public Question save(Question question) {
        return repository.save(question);
    }

    public List<Question> findAll() {
        return repository.findAll();
    }

    public Optional<Question> findById(String id) {
        return repository.findById(id);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

    // Add other service methods as needed
}
