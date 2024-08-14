import React, { useEffect, useState } from 'react';
import axiosInstance from './AxiosInstance';
import '../App.css';  // Import the CSS file

const Home = () => {
    const [arrangements, setArrangements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchArrangements = async () => {
            try {
                const response = await axiosInstance.get('/weekly-work-arrangements');                
                console.log(response.data);
                const groupedArrangements = response.data.reduce((acc, item) => {
                    const { dates, arrangements, notes, id } = item;
                    const existing = acc.find(entry => entry.dates === dates);
                    if (existing) {
                        existing[arrangements.type] = { ...arrangements, notes }; 
                    } else {
                        acc.push({
                            dates,
                            [arrangements.type]: { ...arrangements, notes }, 
                        });
                    }
                    return acc;
                }, []);
                
                setArrangements(groupedArrangements);
                console.log('Grouped weekly-work-arrangements:', groupedArrangements);
            } catch (error) {
                console.error('Error fetching arrangements:', error);
            }
        };

        // Check if the user is an admin by retrieving the value from localStorage
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);

        fetchArrangements();
    }, []);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < arrangements.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const handleDelete = async () => {
        if (isAdmin) {
            const confirmed = window.confirm('Are you sure you want to delete this arrangement?');
            if (confirmed) {
                try {
                    const arrangementDates = arrangements[currentIndex].dates;
                    console.log("dates:", arrangementDates);
                    await axiosInstance.delete(`/admin/weekly-work-arrangement/delete`, { params: { dates: arrangementDates } });
                    setArrangements(prevArrangements => prevArrangements.filter((_, index) => index !== currentIndex));
                    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
                } catch (error) {
                    console.error('Error deleting arrangement:', error);
                }
            }
        } 
    };

    const renderHTML = (html) => {
        return { __html: html };
    };

    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shiftTypes = ['dayShift', 'nightShift'];
    const userTypes = ['waiters', 'bartenders', 'shift_managers'];

    const getArrangementsByType = (type) => {
        return arrangements[currentIndex][type] || { dayShift: {}, nightShift: {}, notes: '' };
    };

    return (
        <div className="container">
            <h1>Weekly Work Arrangements</h1>
            {arrangements.length > 0 ? (
                <div>
                    <div className="card mb-4" key={currentIndex}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span><strong>Dates:</strong> {arrangements[currentIndex].dates}</span>
                                {isAdmin && (
                                    <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                                )}
                            </div>
                            <p className="card-text">
                                <strong>Notes:</strong> 
                                {`Waiters: ${getArrangementsByType('waiters').notes} | 
                                Bartenders: ${getArrangementsByType('bartenders').notes} | 
                                Shift Managers: ${getArrangementsByType('shift_managers').notes}`}
                            </p>
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Type / Shift</th>
                                        {dayOrder.map(day => (
                                            <th key={day}>{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTypes.map(type => (
                                        shiftTypes.map(shiftType => {
                                            const typeArrangements = getArrangementsByType(type);
                                            return (
                                                <tr key={`${type}-${shiftType}`}>
                                                    <td>{type} - {shiftType === 'dayShift' ? 'Day Shift' : 'Night Shift'}</td>
                                                    {dayOrder.map(day => (
                                                        <td key={day} dangerouslySetInnerHTML={renderHTML(
                                                            (typeArrangements[shiftType][day] || []).join('<br>') || 'N/A'
                                                        )}></td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn btn-primary">Previous</button>
                        <button onClick={handleNext} disabled={currentIndex === arrangements.length - 1} className="btn btn-primary">Next</button>
                    </div>
                </div>
            ) : (
                <p>No arrangements found</p>
            )}
        </div>
    );
};

export default Home;
