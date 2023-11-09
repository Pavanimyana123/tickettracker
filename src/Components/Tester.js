import React, { useState, useEffect } from 'react';
import { db } from './Config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Developer() {
  const [tickets, setTickets] = useState([]);
  const [selectedStatusMap, setSelectedStatusMap] = useState({});
  const location = useLocation();
  const isAuthenticated = location.state?.isAuthenticated || false;
  console.log("recieve value isAuthenticated =",isAuthenticated);
  useEffect(() => {
    const fetchTickets = async () => {
      const ticketCollection = collection(db, 'Tickets');
      const querySnapshot = await getDocs(ticketCollection);
      const ticketData = [];
      const statusMap = {};
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        ticketData.push({ id, ...data });
        // Initialize the status map with empty values
        statusMap[id] = '';
      });
      setTickets(ticketData);
      setSelectedStatusMap(statusMap);
    };

    fetchTickets();
  }, []);

  const handleView = (ticketId) => {
    console.log(`Viewing ticket with ID: ${ticketId}`);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setSelectedStatusMap((prevStatusMap) => ({
      ...prevStatusMap,
      [ticketId]: newStatus,
    }));
  };

  const handleSaveStatus = async (ticketId) => {
    const selectedStatus = selectedStatusMap[ticketId];

    try {
      if (selectedStatus === '') {
        console.log('Please select a status before saving.');
        return;
      }

      // Update the status of the ticket in the Firestore database
      const ticketRef = doc(db, 'Tickets', ticketId);
      await updateDoc(ticketRef, { status: selectedStatus });

      // Update the local state to reflect the new status
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: selectedStatus } : ticket
        )
      );

      // Clear the selectedStatus after saving
      handleStatusChange(ticketId, '');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Add the new ticket to the beginning of the tickets array
  const addNewTicket = (newTicket) => {
    setTickets((prevTickets) => [newTicket, ...prevTickets]);
  };

  return (
    <div>
  {isAuthenticated ? (
    <div className="developer">
      <h1 className="text-center m-3">Tester Dashboard</h1>
      <div className="container-fluid">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Problem</th>
              <th>Status</th>
              <th>Created at</th>
              <th>ScreenShot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.id}>
                <td>{index + 1}</td>
                <td>{ticket.Name}</td>
                <td>{ticket.Problem}</td>
                <td>
                  <button
                    className={`btn ${
                      ticket.status === 'Open'
                        ? 'btn-primary'
                        : ticket.status === 'In Progress'
                        ? 'btn-warning'
                        : ticket.status === 'Closed'
                        ? 'btn-success'
                        : 'btn-danger'
                    }`}
                  >
                    {ticket.status}
                  </button>
                </td>
                <td>
                  {ticket.createdAt && new Date(ticket.createdAt.toDate()).toLocaleString()}
                </td>
                <td>
                  {ticket.screenshotURL ? (
                    <img
                      src={ticket.screenshotURL}
                      className="img-thumbnail"
                      alt="Screenshot Thumbnail"
                      style={{ maxWidth: '200px' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>

                <td>
                  <div className="d-flex align-items-center">
                    <select
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      value={selectedStatusMap[ticket.id]}
                      className="form-select"
                    >
                      <option value="">Action</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {selectedStatusMap[ticket.id] && (
                      <button
                        onClick={() => handleSaveStatus(ticket.id)}
                        className="btn btn-primary ms-2"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="text-center">
      <p style={{ marginTop: '50px' }}>
        Please go back to the <Link to="/testerlogin">Tester Login</Link> page.
      </p>
    </div>
  )}
</div>

  );
}

export default Developer;
