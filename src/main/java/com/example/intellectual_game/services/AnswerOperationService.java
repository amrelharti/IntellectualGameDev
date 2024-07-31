package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.AnswerOperation;
import com.example.intellectual_game.Repo.AnswerOperationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerOperationService {

    @Autowired
    private AnswerOperationRepo answerOperationRepository;

    public AnswerOperation createAnswerOperation(AnswerOperation answerOperation) {
        return answerOperationRepository.save(answerOperation);
    }

    public List<AnswerOperation> getAllAnswerOperations() {
        return answerOperationRepository.findAll();
    }

    public AnswerOperation getAnswerOperationById(String id) {
        return answerOperationRepository.findById(id).orElseThrow(() -> new RuntimeException("AnswerOperation not found"));
    }

    public AnswerOperation updateAnswerOperation(String id, AnswerOperation answerOperation) {
        if (!answerOperationRepository.existsById(id)) {
            throw new RuntimeException("AnswerOperation not found");
        }
        answerOperation.setId(id);
        return answerOperationRepository.save(answerOperation);
    }

    public void deleteAnswerOperation(String id) {
        answerOperationRepository.deleteById(id);
    }
}
