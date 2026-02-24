import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    let newErrors = {};

    if (!form.employee_id) {
      newErrors.employee_id = "Employee ID is required";
    } else if (!/^\d+$/.test(form.employee_id)) {
      newErrors.employee_id = "Employee ID must contain numbers only";
    }

    if (!form.full_name) {
      newErrors.full_name = "Full name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    }

    if (!form.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await API.post("employees/", form);

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: ""
      });

      setErrors({});
      fetchEmployees();
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await API.delete(`employees/${id}/`);
      fetchEmployees();
    }
  };

  return (
    <Layout>
      <h1 className="section-title">Employee Management</h1>

      {/* Add Employee */}
      <div className="card">
        <h3 style={{ marginBottom: "15px" }}>Add New Employee</h3>

        <form onSubmit={handleSubmit} className="form-grid">

          <div>
            <input
              placeholder="Employee ID"
              value={form.employee_id}
              onChange={(e)=>setForm({...form, employee_id:e.target.value})}
            />
            {errors.employee_id && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.employee_id}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e)=>setForm({...form, full_name:e.target.value})}
            />
            {errors.full_name && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e)=>setForm({...form, email:e.target.value})}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e)=>setForm({...form, department:e.target.value})}
            />
            {errors.department && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.department}
              </p>
            )}
          </div>

          <button className="btn-primary">Add Employee</button>
        </form>
      </div>

      {/* Employee List */}
      <div className="card">
        <h3 style={{ marginBottom: "15px" }}>Employee List</h3>

        {employees.length === 0 ? (
          <p style={{ color: "#64748b" }}>No employees found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={()=>handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Employees;