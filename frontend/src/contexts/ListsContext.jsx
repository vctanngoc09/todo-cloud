import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { getAllLists, createList, updateList, deleteList } from "../api/list";

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD ALL LISTS =================
  const fetchLists = async () => {
    const token = AuthService.getToken();
    if (!token) {
      setLists([]);
      return;
    }

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
    // 1. Chạy lần đầu
    fetchLists();

    // 2. Lắng nghe tín hiệu từ AuthService
    const handleAuthChange = () => {
      fetchLists();
    };

    window.addEventListener("authChange", handleAuthChange);
    // Vẫn giữ storage để đồng bộ giữa các tab khác nhau
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Để đảm bảo đăng nhập xong là chạy liền, bạn nên lắng nghe giá trị Token
  const currentToken = AuthService.getToken();
  useEffect(() => {
    fetchLists();
  }, [currentToken]); // <--- Mỗi khi Token thay đổi, hàm này sẽ tự chạy

  // ================= CÁC HÀM API KHÁC =================
  const addList = async (data) => {
    const newList = await createList(data);
    setLists((prev) => [...prev, newList]);
    return newList;
  };

  const updateListById = async (data) => {
    const id = data.id;
    try {
      const updated = await updateList(id, data);
      setLists((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updated } : l)),
      );
      return updated;
    } catch (err) {
      console.error("Lỗi khi cập nhật list:", err);
      throw err;
    }
  };

  const deleteListById = async (id) => {
    try {
      await deleteList(id);
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
  if (!context)
    throw new Error("useLists phải được sử dụng trong ListsProvider");
  return context;
};
