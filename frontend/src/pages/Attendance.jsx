import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    status: "Present"
  });

  const fetchData = async () => {
    try {
      const empRes = await API.get("employees/");
      const attRes = await API.get("attendance/");
      setEmployees(empRes.data);
      setAttendance(attRes.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employee || !form.date) {
      alert("Please select employee and date");
      return;
    }

    try {
      await API.post("attendance/", {
        employee: Number(form.employee),
        date: form.date,
        status: form.status
      });

      setForm({
        employee: "",
        date: "",
        status: "Present"
      });

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.non_field_errors ||
        "Failed to mark attendance"
      );
    }
  };

  return (
    <Layout>
      <h1 className="section-title">Attendance Management</h1>

      {/* Attendance Form */}
      <div className="card">
        <h3 style={{ marginBottom: "15px" }}>Mark Attendance</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <select
            value={form.employee}
            onChange={(e)=>setForm({...form, employee:e.target.value})}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e)=>setForm({...form, date:e.target.value})}
          />

          <select
            value={form.status}
            onChange={(e)=>setForm({...form, status:e.target.value})}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <button className="btn-success">Mark Attendance</button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="card">
        <h3 style={{ marginBottom: "15px" }}>Attendance Records</h3>

        {attendance.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No attendance records found.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => {
                const empName =
                  employees.find(e => e.id === record.employee)?.full_name || "Unknown";

                return (
                  <tr key={record.id}>
                    <td>{empName}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={
                        record.status === "Present"
                          ? "badge-present"
                          : "badge-absent"
                      }>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Attendance;