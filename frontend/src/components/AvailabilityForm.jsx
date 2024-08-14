import React, { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetNextWeekDates } from '../utils/GetNextWeekDates'; 

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState(GetNextWeekDates());
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const checkAvailabilityStatus = async () => {
      try {
        const response = await axiosInstance.get('/availability_form');
        const previousAvailability = response.data.previous_availability;
        if (Object.keys(previousAvailability).length > 0) {
          setIsSubmitted(true);
          // Preserve the sorted order when setting previous availability
          setAvailability(prev => sortAvailability(previousAvailability));
        }
      } catch (error) {
        console.error('Error checking availability status', error);
      }
    };
    
    checkAvailabilityStatus();
  }, []);

  const handleChange = (day, field, value) => {
    setAvailability(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: value
      }
    }));
  }; 

  const handleGoBack = async () => {
    try {
      const response = await axiosInstance.get('/availability_form');
      const previousAvailability = response.data.previous_availability;
      if (Object.keys(previousAvailability).length === 0) {
        setAvailability(GetNextWeekDates());
      } else {
        setAvailability(sortAvailability(previousAvailability));
      }
      setIsSubmitted(false);
    } catch (error) {
      console.error('Error fetching previous availability', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('availability_form', { availability_data: availability });
      setIsSubmitted(true); 
    } catch (error) {
      console.error('Error submitting availability', error);
    }
  };

  // Function to sort the availability object by day of the week
  const sortAvailability = (availability) => {
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayOrder.reduce((sorted, day) => {
      if (availability[day]) {
        sorted[day] = availability[day];
      }
      return sorted;
    }, {});
  };

  return (
    <div className="container">
      {isSubmitted ? (
        <div>
          <div className="alert alert-success" role="alert">
            Availability submitted successfully
          </div>
          <button className="btn btn-secondary" onClick={handleGoBack}>Go Back to Availability</button>
        </div>
      ) : (
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
              {Object.keys(availability).map((day) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{availability[day].date}</td>
                  <td>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={availability[day].day_shift}
                        onChange={(e) => handleChange(day, 'day_shift', e.target.checked)}
                      />
                      <label className="form-check-label">Available</label>
                    </div>
                  </td>
                  <td>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={availability[day].night_shift}
                        onChange={(e) => handleChange(day, 'night_shift', e.target.checked)}
                      />
                      <label className="form-check-label">Available</label>
                    </div>
                  </td>
                  <td>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        rows="3"
                        value={availability[day].notes}
                        onChange={(e) => handleChange(day, 'notes', e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" className="btn btn-primary">Submit Availability</button>
        </form>
      )}
    </div>
  );
};

export default AvailabilityForm;
