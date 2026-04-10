import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";

import {
  getTagsByUserId,
  createTag,
  updateTag,
} from "../api/tag";

const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState([]); // ALL TAGS
  const [loading, setLoading] = useState(true);

  const user = AuthService.getUser();
  const userId = user?.id;

  // ================= LOAD ALL TAGS =================
  const fetchTags = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await getTagsByUserId(userId); // ALL tags
      setTags(res);
    } catch (err) {
      console.error("Lỗi load tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [userId]);

  // ================= ADD =================
  const addTag = async (data) => {
    const newTag = await createTag({ ...data, userId });
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  // ================= UPDATE =================
  const updateTagById = async (data) => {
    const id = data.id || data._id;

    const updated = await updateTag(id, data);

    setTags((prev) =>
      prev.map((t) => {
        const tid = t.id || t._id;
        return tid === id ? { ...t, ...updated } : t;
      })
    );

    return updated;
  };

  return (
    <TagsContext.Provider
      value={{
        tags, // ALL TAGS
        loading,
        addTag,
        updateTagById,
        refreshTags: fetchTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => useContext(TagsContext);