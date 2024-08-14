import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { GetNextWeekDates } from '../../utils/GetNextWeekDates';
import { useNavigate } from 'react-router-dom';
import { formatDateRange } from '../../utils/DateRange';   // Importing the function

const SelectWaitersAvailability = () => {
    const [waitersAvailability, setWaitersAvailability] = useState({});
    const [dates, setDates] = useState({});
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axiosInstance.get('/admin/get_availability/waiter');
                console.log(response.data.users_availability);
                setWaitersAvailability(response.data.users_availability);
                setDates(GetNextWeekDates());
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, []);

    const handleSubmit = (e) => {
        console.log(dates);
        e.preventDefault();
        const formData = new FormData(e.target);
        const dayShift = {};
        const nightShift = {};

        Object.keys(dates).forEach(day => {
            dayShift[day] = formData.getAll(`day_shift_waiters_${day}`);
            nightShift[day] = formData.getAll(`night_shift_waiters_${day}`);
        });

        setSelectedAvailability({ dayShift, nightShift });
        setIsSubmitted(true);
    };

    const handleGoBack = () => {
        setIsSubmitted(false);
    };

    const handleCreateNew = async () => {
        const confirmation = window.confirm("Are you sure you want to create new availability?");
        if (!confirmation) return;

        try {
            // Prepare the selected availability with the type 'waiters'
            const selectedAvailabilityWithType = {
                ...selectedAvailability,
                type: 'waiters'
            };

            // Extract the start and end date from the dates object
            const dateRangeArray = Object.values(dates).map(obj => obj.date);
            const startDate = dateRangeArray[0];
            const endDate = dateRangeArray[dateRangeArray.length - 1];

            // Format the date range using the formatDateRange function
            const dateRange = formatDateRange(startDate, endDate);

            // Post the new availability
            await axiosInstance.post('/admin/weekly-work-arrangement', {
                arrangements: selectedAvailabilityWithType,
                dates: dateRange,
                notes: notes,
            });

            // Delete all records in the Availability table for waiters
            await axiosInstance.delete('/admin/delete_availability/waiter');

            // Navigate to the home page
            navigate('/home');

        } catch (error) {
            console.error('Error submitting availability', error);
        }
    };

    const getShiftCounts = (availability) => {
        const shiftCounts = {};

        Object.values(availability.dayShift).flat().forEach(waiter => {
            shiftCounts[waiter] = (shiftCounts[waiter] || 0) + 1;
        });

        Object.values(availability.nightShift).flat().forEach(waiter => {
            shiftCounts[waiter] = (shiftCounts[waiter] || 0) + 1;
        });

        return shiftCounts;
    };

    if (isSubmitted && selectedAvailability) {
        const shiftCounts = getShiftCounts(selectedAvailability);
        return (
            <div className="container">
                <h2 align="center">Selected Waiter Availability</h2>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Day Shift</th>
                            <th>Night Shift</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(dates).map(day => (
                            <tr key={day}>
                                <td>{day}</td>
                                <td>{dates[day].date}</td>
                                <td>
                                    {selectedAvailability.dayShift[day].map(waiter => (
                                        <div key={waiter}>{waiter}</div>
                                    ))}
                                </td>
                                <td>
                                    {selectedAvailability.nightShift[day].map(waiter => (
                                        <div key={waiter}>{waiter}</div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 align="center">Notes</h2>
                <textarea
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes here..."
                ></textarea>

                <h2 align="center">Shift Counts</h2>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Waiter</th>
                            <th>Number of Shifts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(shiftCounts).map(([waiter, count]) => (
                            <tr key={waiter}>
                                <td>{waiter}</td>
                                <td>{count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-secondary" onClick={handleGoBack}>Go Back</button>
                <button className="btn btn-primary" onClick={handleCreateNew}>Create New Availability</button>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 align="center">Waiter Availability</h1>
            <form onSubmit={handleSubmit}>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Day Shift</th>
                            <th>Night Shift</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(dates).map(day => (
                            <tr key={day}>
                                <td>{day}</td>
                                <td>{dates[day].date}</td>
                                <td>
                                    {Object.keys(waitersAvailability).map(waiter => (
                                        waitersAvailability[waiter].map((availability, index) => (
                                            availability.date === dates[day].date && availability.day_shift && (
                                                <div className="form-check" key={index}>
                                                    <input className="form-check-input" type="checkbox" name={`day_shift_waiters_${day}`} value={waiter} id={`${day}_day_${index}`}
                                                    defaultChecked={selectedAvailability?.dayShift[day]?.includes(waiter)} />
                                                    <label className="form-check-label" htmlFor={`${day}_day_${index}`}>{waiter}</label>
                                                </div>
                                            )
                                        ))
                                    ))}
                                </td>
                                <td>
                                    {Object.keys(waitersAvailability).map(waiter => (
                                        waitersAvailability[waiter].map((availability, index) => (
                                            availability.date === dates[day].date && availability.night_shift && (
                                                <div className="form-check" key={index}>
                                                    <input className="form-check-input" type="checkbox" name={`night_shift_waiters_${day}`} value={waiter} id={`${day}_night_${index}`}
                                                    defaultChecked={selectedAvailability?.nightShift[day]?.includes(waiter)} />
                                                    <label className="form-check-label" htmlFor={`${day}_night_${index}`}>{waiter}</label>
                                                </div>
                                            )
                                        ))
                                    ))}
                                </td>
                                <td>
                                    {Object.keys(waitersAvailability).map(waiter => (
                                        waitersAvailability[waiter].map((availability, index) => (
                                            availability.date === dates[day].date && availability.notes && (
                                                <div key={index}>
                                                    {waiter}: {availability.notes}<br />
                                                </div>
                                            )
                                        ))
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className="btn btn-primary">Show Selected Availability</button>
            </form>
        </div>
    );
};

export default SelectWaitersAvailability;
