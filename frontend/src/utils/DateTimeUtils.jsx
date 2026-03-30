class DateTimeUtils {
  static now() {
    return new Date();
  }

  static formatTime(date) {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static getHour(date) {
    return new Date(date).getHours();
  }

  static getMinute(date) {
    return new Date(date).getMinutes();
  }

  static formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  static getHours() {
    const hours = [];

    for (let i = 0; i < 24; i++) {
      const hour = {
        id: i,
        title: `${i.toString().padStart(2, "0")}:00`,
      };
      hours.push(hour);
    }
    return hours;
  }
  // static getHours() {
  //   const hours = [];

  //   for (let i = 0; i < 24; i++) {
  //     hours.push(`${i.toString().padStart(2, "0")}:00`);
  //   }
  //   return hours;
  // }
  static formatDateVN(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
  }
  static formatDateToday() {
    return this.formatDate(new Date());
  }
  static isSameDay(d1, d2) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }
  static isToDay(date) {
    const d = new Date(date);
    const now = new Date();

    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }
  static isCurrentHour(date) {
    const d = new Date(date);
    const now = new Date();

    return (
      d.getHours() === now.getHours() &&
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }
  static getCurrentWeek() {
  const today = new Date();
  const day = today.getDay() || 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    week.push({
      id: d.getDay(),
      title: d.getDay() === 0 ? "Chủ nhật" : `Thứ ${d.getDay() + 1}`,
      date: d,
    });
  }

  return week;
}
}
export default DateTimeUtils;
