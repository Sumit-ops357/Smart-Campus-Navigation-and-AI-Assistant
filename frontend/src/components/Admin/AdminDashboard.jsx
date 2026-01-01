import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminEvents, approveEvent } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending | active | all

  useEffect(() => {
    // Basic protection
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminEvents(token);
      setEvents(data);
    } catch (err) {
      console.error("Failed to load admin events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await approveEvent(eventId, token);
      // Update local state instead of full reload for "premium" feel
      setEvents(prev => prev.map(ev => 
        ev._id === eventId ? { ...ev, isApproved: true } : ev
      ));
    } catch (err) {
      alert("Failed to approve event.");
    }
  };

  const filteredEvents = events.filter(ev => {
    if (activeTab === "pending") return !ev.isApproved;
    if (activeTab === "active") return ev.isApproved;
    return true;
  });

  const stats = {
    total: events.length,
    pending: events.filter(e => !e.isApproved).length,
    active: events.filter(e => e.isApproved).length
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Admin Space...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        
        <header className="admin-header-section">
          <div className="admin-title-group">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}. Here's what's happening on campus.</p>
          </div>
          <button className="btn-icon" title="Refresh" onClick={loadData}>🔄</button>
        </header>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>Pending Approval</h3>
              <p>{stats.pending}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">✅</div>
            <div className="stat-info">
              <h3>Active Events</h3>
              <p>{stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h3>Total Submissions</h3>
              <p>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Approval Queue ({stats.pending})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Live Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All History
          </button>
        </div>

        <div className="admin-content-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Details</th>
                  <th>Organizer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No events found in this section.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(ev => (
                    <tr key={ev._id}>
                      <td>
                        <div className="event-cell">
                          {ev.imageUrl ? (
                            <img className="event-mini-img" src={ev.imageUrl.startsWith('http') ? ev.imageUrl : `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}${ev.imageUrl}`} alt="" />
                          ) : (
                            <div className="event-mini-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
                          )}
                          <div className="event-details">
                            <h4>{ev.title}</h4>
                            <p>{ev.locationName} • {new Date(ev.startTime).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td>{ev.organizer || "Student/Club"}</td>
                      <td>
                        <span className={`status-badge ${ev.isApproved ? 'approved' : 'pending'}`}>
                          {ev.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          {!ev.isApproved && (
                            <button 
                              className="btn-icon approve" 
                              title="Approve"
                              onClick={() => handleApprove(ev._id)}
                            >
                              ✅
                            </button>
                          )}
                          <button className="btn-icon delete" title="Delete" onClick={() => alert("Delete functionality TBD")}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
