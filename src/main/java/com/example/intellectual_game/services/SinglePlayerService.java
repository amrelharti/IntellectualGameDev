package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.*;
import com.example.intellectual_game.Repo.*;
import com.example.intellectual_game.enums.GameState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SinglePlayerService {

    @Autowired
    private GameRepo gameRepository;

    @Autowired
    private PlayerRepo playerRepository;

    @Autowired
    private QuestionRepo questionRepository;

    @Autowired
    private SubjectRepo subjectRepository;

    public Game createSinglePlayerGame(String playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Game game = Game.builder()
                .state(GameState.IN_PROGRESS)
                .scores(0)
                .currentPlayer(player)
                .players(new ArrayList<>(Collections.singletonList(playerId)))
                .usedQuestionIds(new ArrayList<>())
                .build();

        return gameRepository.save(game);
    }

    public Game chooseSubject(String gameId, String subject) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        game.setSubjectsChosen(Collections.singletonList(subject));
        game.setState(GameState.IN_PROGRESS);

        return gameRepository.save(game);
    }

    public Question getNextQuestion(String gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        List<Subject> subjects = subjectRepository.findByNameIn(game.getSubjectsChosen());
        List<Question> availableQuestions = subjects.stream()
                .flatMap(s -> s.getQuestions().stream())
                .filter(q -> !game.getUsedQuestionIds().contains(q.getId()))
                .collect(Collectors.toList());

        if (availableQuestions.isEmpty()) {
            game.setState(GameState.FINISHED);
            gameRepository.save(game);
            throw new RuntimeException("No more questions available");
        }

        Question nextQuestion = availableQuestions.get(new Random().nextInt(availableQuestions.size()));
        game.getUsedQuestionIds().add(nextQuestion.getId());
        gameRepository.save(game);

        return nextQuestion;
    }

    public Game submitAnswer(String gameId, String questionId, String answer, String answerMethod) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answer);
        int score = isCorrect ? calculateScore(answerMethod) : 0;

        game.setScores(game.getScores() + score);

        if (game.getUsedQuestionIds().size() >= 5) {  // Assuming 5 questions per game
            game.setState(GameState.FINISHED);
        }

        return gameRepository.save(game);
    }

    private int calculateScore(String answerMethod) {
        // Implement your scoring logic based on the answer method
        return switch (answerMethod.toLowerCase()) {
            case "carre" -> 10;
            case "duo" -> 5;
            case "cash" -> 15;
            default -> 0;
        };
    }

    public List<String> getAvailableSubjects() {
        return subjectRepository.findAll().stream()
                .map(Subject::getName)
                .collect(Collectors.toList());
    }
}