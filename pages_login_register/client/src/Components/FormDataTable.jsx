import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../Logo/logo.png";
import "./Css/formdata.css";

const FormDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/formdata1");

      // Log the response data for debugging
      console.log("Response data:", response.data);

      const deletedItems = JSON.parse(
        localStorage.getItem("deletedItems") || "[]"
      );
      const updatedData = response.data.map((item) => ({
        ...item,
        isDeleted: deletedItems.includes(item._id),
      }));
      setData(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.response || error.message);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const deletedItems = JSON.parse(
      localStorage.getItem("deletedItems") || "[]"
    );
    deletedItems.push(id);
    localStorage.setItem("deletedItems", JSON.stringify(deletedItems));

    setData(
      data.map((item) =>
        item._id === id ? { ...item, isDeleted: true } : item
      )
    );
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString();
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:3001/api/formdata/${id}/status`, {
        status: status,
      });
      setData(
        data.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (error) {
      console.error("Error updating status:", error.response || error.message);
      setError("Failed to update status. Please try again later.");
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container bg-light p-5">
      <div className="heading-container">
        <h2 className="font-weight-bold text-center">User Data</h2>
      </div>
      <div className="table-actions mb-4 d-flex align-items-center justify-content-between">
        <div
          className="logo"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#0000FF",
            maskImage: `url(${logo})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            marginRight: "15px",
          }}
        />
        <div className="search-bar d-flex align-items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control ml-2"
          />
        </div>
        <button className="btn btn-primary ml-3" onClick={fetchData}>
          Refresh Data
        </button>
      </div>
      <div className="table-container" style={{ marginTop: "20px" }}>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              {[
                "Website URL",
                "Public IP",
                "LBIP",
                "Private IP",
                "Application Manager",
                "HOD",
                "HOG",
                "Certificate",
                "Certificate Upload Date",
                "Certificate Upload Time",
                "Status",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  onClick={() =>
                    handleSort(column.toLowerCase().replace(" ", ""))
                  }
                >
                  {column}
                  {sortColumn === column.toLowerCase().replace(" ", "") && (
                    <span className={`sort-arrow ${sortDirection}`}>
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.websiteURL}</td>
                <td>{item.publicIP}</td>
                <td>{item.lbip}</td>
                <td>{item.privateIP}</td>
                <td>{item.applicationManager}</td>
                <td>{item.hod}</td>
                <td>{item.hog}</td>
                <td>
                  {item.isDeleted ? (
                    <span className="text-muted">N/A</span>
                  ) : (
                    item.certificate && (
                      <a
                        href={`http://localhost:3001/uploads/${item.certificate}`}
                        download
                      >
                        <FaDownload className="download-icon" />
                      </a>
                    )
                  )}
                </td>
                <td>
                  {item.certificateUploadDate
                    ? new Date(item.certificateUploadDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {item.certificateUploadDate
                    ? new Date(item.certificateUploadDate).toLocaleTimeString()
                    : "N/A"}
                </td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  {item.isDeleted ? (
                    <span className="text-muted">Deleted</span>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer mt-4">
        <p>Total Entries: {filteredData.length}</p>
        <p>Current Date and Time: {getCurrentDateTime()}</p>
      </div>
    </div>
  );
};

export default FormDataTable;
