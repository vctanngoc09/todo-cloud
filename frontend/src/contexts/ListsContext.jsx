import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";

// Giả sử các hàm này đã được định nghĩa trong file api/list.js của bạn
import { getAllLists, createList, updateList, deleteList } from "../api/list";

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]); // Chứa tất cả danh sách (Active/Inactive)
  const [loading, setLoading] = useState(true);

  const user = AuthService.getUser();
  const userId = user?.id;

  // ================= LOAD ALL LISTS =================
  const fetchLists = async () => {
    // Lưu ý: Để quản lý được cả list ẩn, bạn nên dùng API lấy toàn bộ
    // Ở đây mình dùng getAllListsActive theo flow hiện tại của bạn
    try {
      setLoading(true);
      const res = await getAllLists();
      setLists(res);
    } catch (err) {
      console.error("Lỗi load lists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [userId]);

  // ================= ADD LIST =================
  const addList = async (data) => {
    const currentUser = AuthService.getUser();
    if (!currentUser) {
      throw new Error("Vui lòng đăng nhập lại.");
    }

    // Gửi yêu cầu tạo list mới (Backend tự lấy User từ Token hoặc bạn gửi kèm ID)
    const newList = await createList(data);
    setLists((prev) => [...prev, newList]);
    return newList;
  };

  // ================= UPDATE LIST =================
  const updateListById = async (data) => {
    const id = data.id;
    try {
      const updated = await updateList(id, data);

      setLists((prev) =>
        prev.map((l) => {
          // Sử dụng cơ chế gộp giống bên Tags
          return l.id === id ? { ...l, ...updated } : l;
        }),
      );

      return updated;
    } catch (err) {
      console.error("Lỗi khi cập nhật list:", err);
      throw err;
    }
  };

  // ================= DELETE LIST (SOFT DELETE) =================
  const deleteListById = async (id) => {
    try {
      // QUAN TRỌNG: Gọi đúng API deleteList (DELETE method)
      // Backend của bạn: @DeleteMapping("/{id}") -> setActive(false)
      await deleteList(id);

      // Sau khi Backend báo thành công, cập nhật UI
      setLists((prev) =>
        prev.map((l) => (l.id === id ? { ...l, active: false } : l)),
      );

      return true;
    } catch (err) {
      console.error("Lỗi khi ẩn list:", err);
      throw err;
    }
  };

  return (
    <ListsContext.Provider
      value={{
        lists,
        loading,
        addList,
        updateListById,
        deleteListById,
        refreshLists: fetchLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists phải được sử dụng trong ListsProvider");
  }
  return context;
};
