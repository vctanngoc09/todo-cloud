import { useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import Day from "./Day/Day";
import Month from "./Month/Month";
import Week from "./Week/Week";
import DateTimeUtils from "../../utils/DateTimeUtils";
function Calendar() {
  const options = {
    Day: "Day",
    Month: "Month",
    Week: "Week",
  };
  const optionsCalendar = {
    [options.Day]: <Day />,
    [options.Month]: <Month />,
    [options.Week]: <Week />,
  };
  const optionList = [
    { key: options.Day, label: "Ngày" },
    { key: options.Month, label: "Tuần" },
    { key: options.Week, label: "Tháng" },
  ];
  const [active, setActive] = useState(options.Day);
 
  const dateToday = DateTimeUtils.formatDateVN(DateTimeUtils.now());

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span> {dateToday}</span>
      </div>
      <div className={styles.options}>
        {optionList.map((option) => (
          <button
            key={option.key}
            onClick={() => setActive(option.key)}
            className={` ${option.key === active ? styles.active : ""}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className={styles.calendar}>{optionsCalendar[active]}</div>
    </div>
  );
}
export default Calendar;
