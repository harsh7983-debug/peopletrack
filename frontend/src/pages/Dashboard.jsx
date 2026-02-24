import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("dashboard/")
      .then(res => setData(res.data))
      .catch(() => alert("Error loading dashboard"));
  }, []);

  if (!data) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Dashboard</h1>

      <div className="card">
        <h3>Total Employees</h3>
        <p>{data.total_employees}</p>
      </div>

      <div className="card">
        <h3>Total Attendance Records</h3>
        <p>{data.total_attendance}</p>
      </div>

      <div className="card">
        <h3>Today Present</h3>
        <p>{data.today_present}</p>
      </div>
    </Layout>
  );
}

export default Dashboard;