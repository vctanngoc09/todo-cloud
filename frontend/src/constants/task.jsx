import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faNoteSticky,
  faCalendarDays,
  faAnglesRight,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

export const IDTASKS = {
  Upcoming: "Upcoming",
  Today: "Today",
  Calendar: "Calendar",
  StickyWall: "StickyWall",
  Tags: "Tags",
};

export const TASKS = [
  {
    id: IDTASKS.Upcoming,
    title: "Sắp tới",
    icon: <FontAwesomeIcon icon={faAnglesRight} />,
  },
  {
    id: IDTASKS.Today,
    title: "Hôm nay",
    icon: <FontAwesomeIcon icon={faCalendarDay} />,
  },
  {
    id: IDTASKS.Calendar,
    title: "Lịch",
    icon: <FontAwesomeIcon icon={faCalendarDays} />,
  },
  {
    id: IDTASKS.StickyWall,
    title: "Ghi chú",
    icon: <FontAwesomeIcon icon={faNoteSticky} />,
  },
  
  {
    id: IDTASKS.Tags,
    title: "Quản lý Tags",
    icon: <FontAwesomeIcon icon={faTags} />,
  },
];