
export const GetNextWeekDates = () => {
    const today = new Date();
    const nextSunday = new Date(today.setDate(today.getDate() - today.getDay() + 14)); 
  
    const weekDates = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(nextSunday);
      date.setDate(nextSunday.getDate() + i);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toISOString().split('T')[0]; 
      weekDates[day] = { date: dateString };
    }
  
    return weekDates;
  };
  