import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { getTagsByUserId, createTag, updateTag } from "../api/tag";

const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD ALL TAGS =================
  const fetchTags = async () => {
    const token = AuthService.getToken();
    // Lấy User ngay tại thời điểm thực thi để đảm bảo dữ liệu mới nhất
    const user = AuthService.getUser();
    const userId = user?.id;

    if (!token) {
      setTags([]);
      return;
    }

    // Nếu có token mà chưa có userId (do delay ghi file),
    // ta có thể đợi một chút hoặc log ra để kiểm tra
    if (!userId) {
      console.warn("TagsContext: Token có nhưng chưa thấy UserId");
      return;
    }

    try {
      setLoading(true);
      const res = await getTagsByUserId(userId);
      setTags(res);
    } catch (err) {
      console.error("Lỗi load tags:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LẮNG NGHE SỰ KIỆN AUTH =================
  useEffect(() => {
    // 1. Chạy lần đầu khi ứng dụng khởi động
    fetchTags();

    // 2. Lắng nghe tín hiệu "authChange" từ AuthService
    const handleAuthChange = () => {
      fetchTags();
    };

    window.addEventListener("authChange", handleAuthChange);

    // Lắng nghe sự kiện storage để đồng bộ nếu mở nhiều tab cùng lúc
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // ================= ADD TAG =================
  const addTag = async (data) => {
    const currentUser = AuthService.getUser();
    const currentUserId = currentUser?.id;

    if (!currentUserId) {
      throw new Error("Không tìm thấy UserId. Vui lòng đăng nhập lại.");
    }

    const newTag = await createTag({ ...data, userId: currentUserId });
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  // ================= UPDATE TAG =================
  const updateTagById = async (data) => {
    const id = data.id || data._id;
    try {
      const updated = await updateTag(id, data);
      setTags((prev) =>
        prev.map((t) => {
          const tid = t.id || t._id;
          return tid === id ? { ...t, ...updated } : t;
        }),
      );
      return updated;
    } catch (err) {
      console.error("Lỗi khi cập nhật nhãn:", err);
      throw err;
    }
  };

  return (
    <TagsContext.Provider
      value={{
        tags,
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

export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) throw new Error("useTags phải được sử dụng trong TagsProvider");
  return context;
};
