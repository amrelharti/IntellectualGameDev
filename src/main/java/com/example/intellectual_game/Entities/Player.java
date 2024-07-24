package com.example.intellectual_game.Entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "players")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Player {
    @Id
    private String id;
    private String username;
    private int score;
    private String email;
    private String password;

    @DBRef
    private AnswerOperation answerOperation; // many to one
    private List<AnswerOperation> answerOperations; //  One To Many
}
