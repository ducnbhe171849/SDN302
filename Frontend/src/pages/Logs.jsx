import React, { useState, useEffect } from "react";
import { customFetch } from "../utils/customAxios";
import { toast } from "react-toastify";
import { redirect, useLoaderData } from "react-router-dom";
import moment from "moment";

export const loader = (store) => async () => {
  const { userState } = store.getState();

  if (!userState?.user) {
    toast.warn("Please login first");
    return redirect("/login");
  }

  if (userState.user?.role != "Admin") {
    toast.error("Forbidden resource");
    return redirect("/login");
  }

  try {
    // check already attendance today
    const res = await customFetch.get("/logs");

    return {
      logs: res.data.data,
    };
  } catch (error) {
    const errorMessage = error?.response?.message || "There was an error";
    toast.error(errorMessage);
    if (error?.response?.status === 401 || 403) {
      return redirect("/login");
    }
  }

  return null;
};
const Logs = () => {
  const { logs: listLogs } = useLoaderData();
  const [logs, setLogs] = useState(listLogs);

  return (
    <div className="container mx-auto p-4">
      <div className="card shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(
                  ({ _id, action, performedBy, details, createdAt }) => (
                    <tr key={_id}>
                      <td>
                        {moment(createdAt).format("HH:mm:ss DD-MM-YYYY")}{" "}
                      </td>
                      <td>
                        <p>{action}</p>
                      </td>{" "}
                      {/* Hiển thị Action */}
                      <td>{details}</td>
                      <td>
                        {performedBy?.username}
                        <br></br>
                        {performedBy?.email}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
