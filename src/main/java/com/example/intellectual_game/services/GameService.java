package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.*;
import com.example.intellectual_game.Repo.*;
import com.example.intellectual_game.enums.GameState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private GameRepo gameRepository;

    @Autowired
    private PlayerRepo playerRepository;

    @Autowired
    private QuestionRepo questionRepository;

    @Autowired
    private SubjectRepo subjectRepository;

    @Autowired
    private AnswerOperationRepo answerOperationRepository;

    public Game createGame(String playerId, List<String> subjectsChosen) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Game game = Game.builder()
                .state(GameState.WAITING_FOR_PLAYERS)
                .subjectsChosen(subjectsChosen)
                .scores(0)
                .currentPlayer(player)
                .players(new ArrayList<>(Collections.singletonList(playerId)))
                .readyPlayers(new ArrayList<>())
                .usedQuestionIds(new ArrayList<>())
                .build();

        return gameRepository.save(game);
    }

    public Game addPlayerToGame(String gameId, String playerId) {
        Game game = getGame(gameId);
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (game.getPlayers().size() >= 2) {
            throw new RuntimeException("Game is full");
        }

        game.getPlayers().add(playerId);

        if (game.getPlayers().size() == 2) {
            game.setState(GameState.STARTING);
        }

        return gameRepository.save(game);
    }

    public Game getGame(String gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public Question getNextQuestion(Game game) {
        List<Subject> subjects = subjectRepository.findByNameIn(game.getSubjectsChosen());
        List<Question> availableQuestions = subjects.stream()
                .flatMap(s -> s.getQuestions().stream())
                .filter(q -> !game.getUsedQuestionIds().contains(q.getId()))
                .collect(Collectors.toList());

        if (availableQuestions.isEmpty()) {
            throw new RuntimeException("No more questions available for the chosen subjects");
        }

        Random random = new Random();
        Question nextQuestion = availableQuestions.get(random.nextInt(availableQuestions.size()));

        game.getUsedQuestionIds().add(nextQuestion.getId());
        gameRepository.save(game);

        return nextQuestion;
    }

    public Game endTurn(String gameId) {
        Game game = getGame(gameId);
        List<String> playerIds = game.getPlayers();
        int currentPlayerIndex = playerIds.indexOf(game.getCurrentPlayer().getId());
        int nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.size();

        Player nextPlayer = playerRepository.findById(playerIds.get(nextPlayerIndex))
                .orElseThrow(() -> new RuntimeException("Next player not found"));
        game.setCurrentPlayer(nextPlayer);

        // Check if it’s the last question
        if (isLastQuestion(game)) {
            game.setState(GameState.FINISHED);
            // Set winner based on scores
            setWinner(game.getId(), game.getCurrentPlayer().getId()); // Set winner using current player ID
        }

        return gameRepository.save(game);
    }


    public boolean checkAnswer(Game game, String questionId, String answer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return question.getCorrectAnswer().equalsIgnoreCase(answer);
    }
    public Game updateGameScores(String gameId, Map<String, Integer> scores) {
        Game game = getGame(gameId);

        // Update game scores and player scores
        scores.forEach((playerId, points) -> {
            Player player = playerRepository.findById(playerId)
                    .orElseThrow(() -> new RuntimeException("Player not found"));
            player.setScore(player.getScore() + points);
            playerRepository.save(player);
        });

        // Update game scores
        game.setScores(scores.values().stream().mapToInt(Integer::intValue).sum());

        return gameRepository.save(game);
    }

    public boolean isLastQuestion(Game game) {
        return game.getUsedQuestionIds().size() >= game.getSubjectsChosen().size() * 5; // Assuming 5 questions per subject
    }

    public void setWinner(String gameId, String playerId) {
        // Fetch the game by its ID
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Fetch the specified player
        Player specifiedPlayer = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        // Fetch all players in the game
        List<Player> players = game.getPlayers().stream()
                .map(pid -> playerRepository.findById(pid)
                        .orElseThrow(() -> new RuntimeException("Player not found")))
                .collect(Collectors.toList());

        // Determine the player with the highest score
        Player winner = players.stream()
                .max(Comparator.comparingInt(Player::getScore))
                .orElseThrow(() -> new RuntimeException("No winner found"));

        // Check if the specified player has the highest score
        if (specifiedPlayer.equals(winner)) {
            // Set the specified player as the winner
            game.setWinner(specifiedPlayer);
        } else {
            throw new RuntimeException("Specified player is not the winner based on scores");
        }

        // Save the updated game entity
        gameRepository.save(game);
    }


    public Game updateGameState(String gameId, GameState gameState) {
        Game game = getGame(gameId);
        game.setState(gameState);
        return gameRepository.save(game);
    }

    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game chooseSubject(String gameId, String playerId, String subject) {
        Game game = getGame(gameId);
        if (!game.getPlayers().contains(playerId)) {
            throw new RuntimeException("Player is not in this game");
        }
        game.getSubjectsChosen().add(subject);
        return gameRepository.save(game);
    }
    public Game findWaitingGame() {
        return gameRepository.findByState(GameState.WAITING_FOR_PLAYERS).stream()
                .filter(g -> g.getPlayers().size() < 2)
                .findFirst()
                .orElse(null);
    }

    public AnswerOperation createAnswerOperation(Game game, Player player, Question question, String answer, int score) {
        AnswerOperation answerOperation = AnswerOperation.builder()
                .answerType(null) // Set this based on your game logic
                .answer(answer)
                .score(score)
                .question(question)
                .players(Collections.singletonList(player))
                .build();

        answerOperation = answerOperationRepository.save(answerOperation);
        game.getAnswerOperations().add(answerOperation);
        gameRepository.save(game);

        return answerOperation;
    }
    public Game markPlayerReady(String gameId, String playerId) {
        Game game = getGame(gameId);
        if (!game.getPlayers().contains(playerId)) {
            throw new RuntimeException("Player is not in this game");
        }
        if (!game.getReadyPlayers().contains(playerId)) {
            game.getReadyPlayers().add(playerId);
        }
        if (areAllPlayersReady(game)) {
            game.setState(GameState.STARTING);
        }
        return gameRepository.save(game);
    }

    public boolean areAllPlayersReady(Game game) {
        return game.getPlayers().size() == game.getReadyPlayers().size();
    }

    public Game startGame(String gameId) {
        Game game = getGame(gameId);
        if (!areAllPlayersReady(game)) {
            throw new RuntimeException("Not all players are ready");
        }
        game.setState(GameState.STARTING);
        // Additional logic to set up the game (e.g., initialize questions, set current player, etc.)
        return gameRepository.save(game);
    }

}