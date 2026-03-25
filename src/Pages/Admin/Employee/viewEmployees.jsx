import { useEffect, useState } from "react";
import { employees } from "../../utils/mockData";
import axios from "axios";

const ViewEmployee = () => {

    //   const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("/api/employees");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            await axios.delete(`/api/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (emp) => {
        setEditingEmployee(emp);
    };

    const handleChange = (e) => {
        setEditingEmployee({
            ...editingEmployee,
            [e.target.name]: e.target.value
        });
    };

    const updateEmployee = async () => {
        try {
            await axios.put(`/api/employees/${editingEmployee.id}`, editingEmployee);
            setEditingEmployee(null);
            fetchEmployees();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">Employee List</h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">First Name</th>
                            <th className="p-2 border">Middle Name</th>
                            <th className="p-2 border">Last Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Gender</th>
                            <th className="p-2 border">Contact</th>
                            <th className="p-2 border">Designation</th>
                            <th className="p-2 border">Join Date</th>
                            <th className="p-2 border">End Date</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>

                                <td className="p-2 border">{emp.id}</td>
                                <td className="p-2 border">{emp.employeeFname}</td>
                                <td className="p-2 border">{emp.employeeMname}</td>
                                <td className="p-2 border">{emp.employeeLname}</td>
                                <td className="p-2 border">{emp.employeeEmail}</td>
                                <td className="p-2 border">{emp.gender}</td>
                                <td className="p-2 border">{emp.contactNo}</td>
                                <td className="p-2 border">{emp.designation}</td>
                                <td className="p-2 border">{emp.joinDate}</td>
                                <td className="p-2 border">{emp.endDate || "-"}</td>

                                <td className="p-2 border">
                                    <span className={emp.status === "Active" ? "text-green-600" : "text-red-500"}>
                                        {emp.status}
                                    </span>
                                </td>

                                <td className="p-2 border space-x-2">

                                    <button
                                        onClick={() => startEdit(emp)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteEmployee(emp.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {editingEmployee && (

                <div className="mt-6 border p-4 rounded">

                    <h3 className="font-bold mb-3">Update Employee</h3>

                    <input name="employeeFname" value={editingEmployee.employeeFname} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="First Name" />
                    <input name="employeeMname" value={editingEmployee.employeeMname} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Middle Name" />
                    <input name="employeeLname" value={editingEmployee.employeeLname} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Last Name" />

                    <input name="employeeEmail" value={editingEmployee.employeeEmail} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Email" />

                    <input name="gender" value={editingEmployee.gender} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Gender" />

                    <input name="contactNo" value={editingEmployee.contactNo} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Contact No" />

                    <input name="designation" value={editingEmployee.designation} onChange={handleChange} className="border p-2 mr-2 mb-2" placeholder="Designation" />

                    <input type="date" name="joinDate" value={editingEmployee.joinDate} onChange={handleChange} className="border p-2 mr-2 mb-2" />

                    <input type="date" name="endDate" value={editingEmployee.endDate || ""} onChange={handleChange} className="border p-2 mr-2 mb-2" />

                    <select name="status" value={editingEmployee.status} onChange={handleChange} className="border p-2 mr-2 mb-2">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <br />

                    <button
                        onClick={updateEmployee}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                    >
                        Save
                    </button>

                    <button
                        onClick={() => setEditingEmployee(null)}
                        className="ml-2 bg-gray-500 text-white px-3 py-2 rounded"
                    >
                        Cancel
                    </button>

                </div>

            )}

        </div>
    );
};

export default ViewEmployee;