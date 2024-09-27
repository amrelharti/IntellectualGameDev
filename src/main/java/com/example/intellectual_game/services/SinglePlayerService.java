package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.Entities.Subject;
import com.example.intellectual_game.Entities.Question;
import com.example.intellectual_game.Repo.GameRepo;
import com.example.intellectual_game.Repo.PlayerRepo;
import com.example.intellectual_game.Repo.QuestionRepo;
import com.example.intellectual_game.enums.GameState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class SinglePlayerService {

    @Autowired
    private GameRepo gameRepository;

    @Autowired
    private PlayerRepo playerRepository;

    @Autowired
    private QuestionRepo questionRepository;

    public Game createSinglePlayerGame(String playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Game game = Game.builder()
                .state(GameState.IN_PROGRESS)
                .scores(0)
                .currentPlayer(player)
                .players(Collections.singletonList(playerId))
                .usedQuestionIds(new ArrayList<>())
                .build();

        return gameRepository.save(game);
    }

    public Question getNextQuestion(String gameId) {
        // Retrieve the game object
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Fetch questions that haven't been used in the game yet
        List<Question> availableQuestions = questionRepository.findAll().stream()
                .filter(q -> !game.getUsedQuestionIds().contains(q.getId()))
                .toList();

        // If no more questions are available, throw an exception
        if (availableQuestions.isEmpty()) {
            throw new RuntimeException("No more questions available");
        }

        // Randomly select the next question from the available questions
        Random random = new Random();
        Question nextQuestion = availableQuestions.get(random.nextInt(availableQuestions.size()));

        // Add the selected question's ID to the used question list and save the game state
        game.getUsedQuestionIds().add(nextQuestion.getId());
        gameRepository.save(game);

        // Prepare options for the question
        List<String> options = new ArrayList<>(nextQuestion.getOptions());

        // Include the correct answer in the options
        options.add(nextQuestion.getCorrectAnswer());

        // Shuffle the options to randomize their order
        Collections.shuffle(options);

        // Set the shuffled options in the question object
        nextQuestion.setOptions(options);

        // Optionally, if you need to maintain the correct answer separately, you can
        // create a temporary object or add a field to the Question class to hold it.
        nextQuestion.setCorrectAnswer(nextQuestion.getCorrectAnswer()); // This line is optional if you need to retain it.

        return nextQuestion;
    }

    public Game submitAnswer(String gameId, String questionId, String answer, String answerType) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean isCorrect = false;
        int score = 0;

        switch (answerType) {
            case "CARRÉ":
                isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answer);
                score = isCorrect ? 10 : 0;
                break;
            case "DUO":
                isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answer);
                score = isCorrect ? 5 : 0;
                break;
            case "CASH":
                isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answer); // Case-insensitive comparison
                score = isCorrect ? 15 : 0;
                break;
        }

        game.setScores(game.getScores() + score);

        // Mark game as finished only if 10 questions have been answered
        if (game.getUsedQuestionIds().size() >= 10) {
            game.setState(GameState.FINISHED);
        }

        return gameRepository.save(game);
    }




    public List<String> getAvailableSubjects() {
        return questionRepository.findAll().stream()
                .map(Question::getSubject)
                .distinct()
                .map(Subject::getName)  // Assuming Subject has a getName() method
                .collect(Collectors.toList());
    }
}