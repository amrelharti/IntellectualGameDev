package com.example.intellectual_game.Entities;

import com.example.intellectual_game.enums.GameState;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "games")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Game {
    @Id
    private String id;
    private GameState state;
    private List<String> subjectsChosen = new ArrayList<>();
    private Integer scores;

    private List<AnswerOperation> answerOperations = new ArrayList<>();
    private Player winner;
    private Player currentPlayer;
    private List<String> players = new ArrayList<>();
    private List<String> readyPlayers = new ArrayList<>();
    private List<String> usedQuestionIds = new ArrayList<>();  // New field
}