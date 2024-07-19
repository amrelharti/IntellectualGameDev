package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.AnswerOperation;
import com.example.intellectual_game.Repo.AnswerOperationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerOperationService {

    @Autowired
    private AnswerOperationRepo repository;

    public AnswerOperation save(AnswerOperation answerOperation) {
        return repository.save(answerOperation);
    }

    public List<AnswerOperation> findAll() {
        return repository.findAll();
    }

    public Optional<AnswerOperation> findById(String id) {
        return repository.findById(id);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

}
