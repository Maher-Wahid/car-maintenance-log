import { useState, useEffect } from "react";
import supabase from "./helper/supabaseClient";

function App() {
    const [logs, setLogs] = useState([]);
    const [vehicle, setVehicle] = useState("");
    const [date, setDate] = useState("");
    const [service, setService] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const { data, error } = await supabase
            .from("logs")
            .select("*")
            .order("date", { ascending: false });

        if (error) console.log(error);
        else setLogs(data);
    }

    async function addService() {
        if (!vehicle.trim() || !service.trim() || !date.trim()) return;

        const { error } = await supabase.from("logs").insert([{ vehicle, date, service }]);

        if (error) console.log(error);
        else {
            setVehicle("");
            setDate("");
            setService("");
            fetchServices();
        }
    }

    async function deleteService(id) {
        await supabase.from("logs").delete().eq("id", id);
        fetchServices();
    }

    return (
        <div className="app">
            <h1>Car Maintenance Log</h1>
            <div>
                <div className="add-new-section">
                    <div className="vehicle-date">
                        <input
                            value={vehicle}
                            onChange={(e) => setVehicle(e.target.value)}
                            placeholder="Add a vehicle"
                        />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <input
                        className="service-input"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="Add service details"
                    />

                    <div className="add-btn-container">
                        <button className="add-btn" onClick={addService}>
                            Add Service
                        </button>
                    </div>
                </div>

                <h2>All service records</h2>
                <div className="services">
                    {logs.length === 0 ? (
                        <p className="empty-label">There are currently no services recorded.</p>
                    ) : (
                        logs.map((log) => (
                            <div className="log" key={log.id}>
                                <span className="vehicle">• {log.vehicle}</span>
                                <span className="date">{log.date}</span>
                                <span className="service">{log.service}</span>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteService(log.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
