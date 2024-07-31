package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Question;
import com.example.intellectual_game.Repo.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepo questionRepository;

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(String id) {
        return questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question updateQuestion(String id, Question question) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        question.setId(id);
        return questionRepository.save(question);
    }

    public void deleteQuestion(String id) {
        questionRepository.deleteById(id);
    }
}
