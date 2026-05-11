import { useEffect, useState } from "react";
import api from "./services/api";
import { getPriorityScore } from "./utils/priority";
import { logger } from "./logger";

type NotificationType = {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
};

function App() {
  const [notifications, setNotifications] = useState<
    NotificationType[]
  >([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      logger("Fetching notifications");

      const response = await api.get("/notifications");

      console.log(response.data);

      const data =
        response.data.notifications || response.data;

      const sortedNotifications = data.sort(
        (a: NotificationType, b: NotificationType) => {
          const priorityDiff =
            getPriorityScore(b.Type) -
            getPriorityScore(a.Type);

          if (priorityDiff !== 0) {
            return priorityDiff;
          }

          return (
            new Date(b.Timestamp).getTime() -
            new Date(a.Timestamp).getTime()
          );
        }
      );

      const top10 = sortedNotifications.slice(0, 10);

      setNotifications(top10);

      logger("Notifications fetched successfully");
    } catch (error) {
      console.log(error);

      logger("Error fetching notifications");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Campus Notification System</h1>

      <h2>Top 10 Priority Notifications</h2>

      {notifications.map((item) => (
        <div
          key={item.ID}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{item.Type}</h3>

          <p>{item.Message}</p>

          <small>{item.Timestamp}</small>
        </div>
      ))}
    </div>
  );
}

export default App;