package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.StickyNoteRequest;
import edu.ut.todocloud.dto.response.StickyNoteResponse;
import edu.ut.todocloud.service.IStickyNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sticky-notes")
@CrossOrigin(origins = "*")
public class StickyNoteController {

    @Autowired
    private IStickyNoteService service;

    @PostMapping
    public StickyNoteResponse create(@RequestBody StickyNoteRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public StickyNoteResponse update(@PathVariable Long id,
                                     @RequestBody StickyNoteRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    public List<StickyNoteResponse> getMyNotes() {
        return service.getMyNotes();
    }
}