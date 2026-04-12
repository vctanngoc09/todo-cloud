import axiosInstance from "./axiosInstance";

// CREATE
export const createStickyNote = (data) => {
  return axiosInstance.post("/sticky-notes", data);
};

// UPDATE
export const updateStickyNote = (id, data) => {
  return axiosInstance.put(`/sticky-notes/${id}`, data);
};

// DELETE
export const deleteStickyNote = (id) => {
  return axiosInstance.delete(`/sticky-notes/${id}`);
};

// GET ALL (current user)
export const getMyStickyNotes = () => {
  return axiosInstance.get("/sticky-notes");
};
