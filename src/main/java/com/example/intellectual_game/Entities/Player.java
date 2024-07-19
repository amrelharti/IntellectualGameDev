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
    private String name;
    private int score;
    private String email;

    @DBRef
    private AnswerOperation answerOperation; // many to one
    private List<AnswerOperation> answerOperations; //  One To Many
}
