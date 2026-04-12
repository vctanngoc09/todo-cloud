package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.StickyNoteRequest;
import edu.ut.todocloud.dto.response.StickyNoteResponse;

import java.util.List;

public interface IStickyNoteService {

    StickyNoteResponse create(StickyNoteRequest request);

    StickyNoteResponse update(Long id, StickyNoteRequest request);

    void delete(Long id);

    List<StickyNoteResponse> getMyNotes();
}