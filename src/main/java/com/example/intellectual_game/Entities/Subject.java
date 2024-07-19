package com.example.intellectual_game.Entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Subject {
    @Id
    private String id;
    private String name;

    @DBRef
    private List<Question> questions;
}
