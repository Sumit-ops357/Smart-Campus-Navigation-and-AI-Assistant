import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as sportsService from "../../services/sportsService";
import "../../styles/sports.css";

export default function SportsPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("facilities"); // facilities | my-bookings | playmates
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [playmates, setPlaymates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: "", startTime: "", endTime: "" });
  const [requestForm, setRequestForm] = useState({ sport: "", message: "", playersNeeded: 1, playDateTime: "" });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "facilities") {
        const data = await sportsService.fetchFacilities();
        setFacilities(Array.isArray(data) ? data : []);
      } else if (activeTab === "my-bookings") {
        const data = await sportsService.fetchMyBookings(token);
        setBookings(Array.isArray(data) ? data : []);
      } else if (activeTab === "playmates") {
        const data = await sportsService.fetchPlaymateRequests();
        setPlaymates(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load sports data", err);
      // Optional: Add a toast notification here
      if (activeTab === "my-bookings") setBookings([]); // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPlaymate = async (requestId) => {
    try {
      await sportsService.joinPlaymateRequest(requestId, token);
      loadData();
    } catch (err) {
      alert("Failed to join request");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await sportsService.cancelBooking(bookingId, token);
      loadData();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await sportsService.createBooking({
        facilityId: selectedFacility._id,
        ...bookingForm
      }, token);
      alert("Booking confirmed!");
      setShowBookingModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await sportsService.createPlaymateRequest({
        ...requestForm,
        facility: facilities[0]?._id 
      }, token);
      alert("Request posted!");
      setShowRequestModal(false);
      loadData();
    } catch (err) {
      alert("Failed to post request");
    }
  };

  return (
    <div className="sports-page premium">
      <div className="sports-container">
        
        <header className="sports-hero">
          <h1 className="sports-title">Campus Sports Hub</h1>
          <p className="sports-subtitle">Book courts, find teammates, and track your fitness.</p>
          
          <div className="sports-tabs-pills">
            <button className={activeTab === 'facilities' ? 'active' : ''} onClick={() => setActiveTab('facilities')}>Facilities</button>
            <button className={activeTab === 'my-bookings' ? 'active' : ''} onClick={() => setActiveTab('my-bookings')}>My Bookings</button>
            <button className={activeTab === 'playmates' ? 'active' : ''} onClick={() => setActiveTab('playmates')}>Find Playmates</button>
          </div>
        </header>

        {loading ? (
          <div className="sports-loader">
            <div className="spinner"></div>
            <p>Loading Sports Data...</p>
          </div>
        ) : (
          <main className="sports-main-content">
            
            {activeTab === "facilities" && (
              <div className="sports-grid animate-fade-in">
                {facilities.length === 0 ? (
                  <div className="empty-state">No facilities registered yet. Contact admin.</div>
                ) : (
                  facilities.map(fac => (
                    <div key={fac._id} className="facility-card-ios" onClick={() => setSelectedFacility(fac)}>
                      <div className="fac-img-box" style={{ backgroundImage: `url(${fac.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'})` }}>
                        <span className="fac-badge">{fac.category}</span>
                      </div>
                      <div className="fac-info">
                        <h3>{fac.name}</h3>
                        <p className="fac-loc">📍 {fac.location}</p>
                        <div className="fac-stats">
                          <span className="stat-item">🕒 {fac.timings?.open} - {fac.timings?.close}</span>
                          <span className={`status-dot ${fac.isAvailable ? 'available' : 'busy'}`}>
                            {fac.isAvailable ? 'Open' : 'Restricted'}
                          </span>
                        </div>
                        <button className="book-mini-btn" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFacility(fac);
                          setShowBookingModal(true);
                        }}>Book Slot</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "playmates" && (
              <div className="playmates-board animate-fade-in">
                <div className="board-header">
                  <h2>Looking for Players</h2>
                  <button className="btn-create-request" onClick={() => setShowRequestModal(true)}>+ Post Request</button>
                </div>
                <div className="requests-grid">
                  {playmates.map(req => (
                    <div key={req._id} className="request-card">
                      <div className="req-header">
                        <span className="req-sport">{req.sport}</span>
                        <span className="req-players">{req.playersNeeded - req.joinedPlayers.length} spots left</span>
                      </div>
                      <p className="req-msg">"{req.message}"</p>
                      <div className="req-footer">
                        <span className="req-user">👤 {req.user?.name}</span>
                        <span className="req-time">⏰ {new Date(req.playDateTime).toLocaleString()}</span>
                      </div>
                      <button 
                        className="join-req-btn" 
                        onClick={() => handleJoinPlaymate(req._id)}
                        disabled={req.joinedPlayers.includes(user?._id)}
                      >
                        {req.joinedPlayers.includes(user?._id) ? "Joined" : "Join Match"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "my-bookings" && (
              <div className="bookings-view animate-fade-in">
                {bookings.length === 0 ? (
                  <p className="empty-text">You haven't booked any slots yet.</p>
                ) : (
                  <div className="bookings-list">
                    {bookings.map(b => (
                      <div key={b._id} className="booking-card">
                        <div className="b-img-box" style={{ backgroundImage: `url(${b.facility?.imageUrl})` }}></div>
                        <div className="b-details">
                          <div className="b-info">
                            <h4>{b.facility?.name}</h4>
                            <p>📅 {new Date(b.date).toLocaleDateString()}</p>
                            <p>🕒 {b.startTime} - {b.endTime}</p>
                          </div>
                          <div className="b-actions">
                            <span className={`b-status ${b.status}`}>{b.status}</span>
                            {b.status === 'confirmed' && (
                              <button onClick={() => handleCancelBooking(b._id)} className="btn-cancel-link">Cancel</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        )}

        {/* BOOKING MODAL */}
        {showBookingModal && (
          <div className="sports-modal-overlay">
            <div className="sports-action-modal">
              <h2>Book {selectedFacility?.name}</h2>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" required value={bookingForm.startTime} onChange={e => setBookingForm({...bookingForm, startTime: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input type="time" required value={bookingForm.endTime} onChange={e => setBookingForm({...bookingForm, endTime: e.target.value})} />
                  </div>
                </div>
                <div className="modal-btns">
                  <button type="button" className="btn-cancel" onClick={() => setShowBookingModal(false)}>Cancel</button>
                  <button type="submit" className="btn-confirm">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PLAYMATE REQUEST MODAL */}
        {showRequestModal && (
          <div className="sports-modal-overlay">
            <div className="sports-action-modal">
              <h2>Find a Playmate</h2>
              <form onSubmit={handleRequestSubmit}>
                <div className="form-group">
                  <label>Sport</label>
                  <input type="text" placeholder="e.g. Badminton" required value={requestForm.sport} onChange={e => setRequestForm({...requestForm, sport: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="e.g. Need one for doubles!" required value={requestForm.message} onChange={e => setRequestForm({...requestForm, message: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Players Needed</label>
                    <input type="number" min="1" required value={requestForm.playersNeeded} onChange={e => setRequestForm({...requestForm, playersNeeded: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" required value={requestForm.playDateTime} onChange={e => setRequestForm({...requestForm, playDateTime: e.target.value})} />
                  </div>
                </div>
                <div className="modal-btns">
                  <button type="button" className="btn-cancel" onClick={() => setShowRequestModal(false)}>Cancel</button>
                  <button type="submit" className="btn-confirm">Post Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
