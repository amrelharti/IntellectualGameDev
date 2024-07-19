package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Subject;
import com.example.intellectual_game.Repo.SubjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepo repository;

    public Subject save(Subject subject) {
        return repository.save(subject);
    }

    public List<Subject> findAll() {
        return repository.findAll();
    }

    public Optional<Subject> findById(String id) {
        return repository.findById(id);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

}
