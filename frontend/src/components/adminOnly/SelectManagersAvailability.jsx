import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { GetNextWeekDates } from '../../utils/GetNextWeekDates';
import { useNavigate } from 'react-router-dom';
import { formatDateRange } from '../../utils/DateRange';

const SelectShiftManagersAvailability = () => {
    const [shiftManagersAvailability, setShiftManagersAvailability] = useState({});
    const [dates, setDates] = useState({});
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axiosInstance.get('/admin/get_availability/shift_manager');
                console.log(response.data.users_availability);
                setShiftManagersAvailability(response.data.users_availability);
                setDates(GetNextWeekDates());
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, []);

    const handleSubmit = (e) => {
        console.log(dates)
        e.preventDefault();
        const formData = new FormData(e.target);
        const dayShift = {};
        const nightShift = {};

        Object.keys(dates).forEach(day => {
            dayShift[day] = formData.getAll(`day_shift_shift_managers_${day}`);
            nightShift[day] = formData.getAll(`night_shift_shift_managers_${day}`);
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
            const selectedAvailabilityWithType = {
                ...selectedAvailability,
                type: 'shift_managers'
            };
    
            const dateRangeArray = Object.values(dates).map(obj => obj.date);
            const startDate = dateRangeArray[0];
            const endDate = dateRangeArray[dateRangeArray.length - 1];

           
            const dateRange = formatDateRange(startDate, endDate);

            await axiosInstance.post('/admin/weekly-work-arrangement', {
                arrangements: selectedAvailabilityWithType,
                dates: dateRange,
                notes: notes,
            });
            await axiosInstance.delete('/admin/delete_availability/shift_manager');
            navigate('/home');

        } catch (error) {
            console.error('Error submitting availability', error);
        }
    };

    const getShiftCounts = (availability) => {
        const shiftCounts = {};

        Object.values(availability.dayShift).flat().forEach(shift_manager => {
            shiftCounts[shift_manager] = (shiftCounts[shift_manager] || 0) + 1;
        });

        Object.values(availability.nightShift).flat().forEach(shift_manager => {
            shiftCounts[shift_manager] = (shiftCounts[shift_manager] || 0) + 1;
        });

        return shiftCounts;
    };

    if (isSubmitted && selectedAvailability) {
        const shiftCounts = getShiftCounts(selectedAvailability);
        return (
            <div className="container">
                <h2 align="center">Selected Shift Managers Availability</h2>
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
                                    {selectedAvailability.dayShift[day].map(shift_manager => (
                                        <div key={shift_manager}>{shift_manager}</div>
                                    ))}
                                </td>
                                <td>
                                    {selectedAvailability.nightShift[day].map(shift_manager => (
                                        <div key={shift_manager}>{shift_manager}</div>
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
                            <th>Shift Managers</th>
                            <th>Number of Shifts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(shiftCounts).map(([shift_manager, count]) => (
                            <tr key={shift_manager}>
                                <td>{shift_manager}</td>
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
            <h1 align="center">Shift Manager Availability</h1>
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
                                    {Object.keys(shiftManagersAvailability).map(shift_manager => (
                                        shiftManagersAvailability[shift_manager].map((availability, index) => (
                                            availability.date === dates[day].date && availability.day_shift && (
                                                <div className="form-check" key={index}>
                                                    <input className="form-check-input" type="checkbox" name={`day_shift_shift_managers_${day}`} value={shift_manager} id={`${day}_day_${index}`} 
                                                    defaultChecked={selectedAvailability?.dayShift[day]?.includes(shift_manager)} />
                                                    <label className="form-check-label" htmlFor={`${day}_day_${index}`}>{shift_manager}</label>
                                                </div>
                                            )
                                        ))
                                    ))}
                                </td>
                                <td>
                                    {Object.keys(shiftManagersAvailability).map(shift_manager => (
                                        shiftManagersAvailability[shift_manager].map((availability, index) => (
                                            availability.date === dates[day].date && availability.night_shift && (
                                                <div className="form-check" key={index}>
                                                    <input className="form-check-input" type="checkbox" name={`night_shift_shift_managers_${day}`} value={shift_manager} id={`${day}_night_${index}`} 
                                                    defaultChecked={selectedAvailability?.nightShift[day]?.includes(shift_manager)} />
                                                    <label className="form-check-label" htmlFor={`${day}_night_${index}`}>{shift_manager}</label>
                                                </div>
                                            )
                                        ))
                                    ))}
                                </td>
                                <td>
                                    {Object.keys(shiftManagersAvailability).map(shift_manager => (
                                        shiftManagersAvailability[shift_manager].map((availability, index) => (
                                            availability.date === dates[day].date && availability.notes && (
                                                <div key={index}>
                                                    {shift_manager}: {availability.notes}<br />
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

export default SelectShiftManagersAvailability;
