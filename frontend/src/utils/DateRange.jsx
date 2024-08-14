// src/utils/dateUtils.js

export const formatDateRange = (startDate, endDate) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
};
