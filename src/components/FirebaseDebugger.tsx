import { useEffect, useState } from "react";
import { database } from "@/integrations/firebase/config";
import { ref, onValue, set } from "firebase/database";

const FirebaseDebugger = () => {
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Firebase Debugger started");

    // Test Firebase connection
    const testConnection = async () => {
      try {
        console.log("🧪 Testing Firebase connection...");

        // Try to write test data
        const testRef = ref(database, "test/connection");
        await set(testRef, {
          timestamp: Date.now(),
          message: "Firebase connection test",
        });

        console.log("✅ Test data written successfully");

        // Try to read test data
        const unsubscribe = onValue(
          testRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log("✅ Test data read successfully:", data);
              setTestData(data);
              setConnectionStatus("connected");
            } else {
              console.log("❌ No test data found");
              setConnectionStatus("no-data");
            }
          },
          (error) => {
            console.error("🚨 Firebase read error:", error);
            setError(error.message);
            setConnectionStatus("error");
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("🚨 Firebase connection error:", error);
        setError(error.message);
        setConnectionStatus("error");
      }
    };

    const cleanup = testConnection();
    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "black",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        maxWidth: "300px",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>🔥 Firebase Debug</strong>
      </div>
      <div>Status: {connectionStatus}</div>
      <div>
        API Key:{" "}
        {import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing"}
      </div>
      <div>
        Database URL:{" "}
        {import.meta.env.VITE_FIREBASE_DATABASE_URL ? "✅ Set" : "❌ Missing"}
      </div>
      <div>
        Project ID:{" "}
        {import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"}
      </div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {testData && <div>Test Data: ✅</div>}
    </div>
  );
};

export default FirebaseDebugger;
