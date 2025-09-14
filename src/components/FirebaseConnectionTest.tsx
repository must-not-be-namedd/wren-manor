import React, { useEffect, useState } from "react";
import { database } from "../integrations/firebase/config";
import { ref, set, onValue, off } from "firebase/database";

interface TestData {
  timestamp: number;
  message: string;
}

export const FirebaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");
  const [testData, setTestData] = useState<TestData | null>(null);

  useEffect(() => {
    console.log("🔧 Starting Firebase connection test...");

    // Test 1: Check if database is initialized
    if (!database) {
      console.error("❌ Firebase database is not initialized");
      setConnectionStatus("❌ Database not initialized");
      return;
    }

    console.log("✅ Firebase database object exists");

    // Test 2: Try to write test data
    const testRef = ref(database, "connection-test");
    const testValue = {
      timestamp: Date.now(),
      message: "Firebase connection test",
    };

    console.log("📝 Attempting to write test data...");
    set(testRef, testValue)
      .then(() => {
        console.log("✅ Successfully wrote test data to Firebase");
        setConnectionStatus("✅ Write successful");
      })
      .catch((error) => {
        console.error("❌ Failed to write test data:", error);
        setConnectionStatus(`❌ Write failed: ${error.message}`);
      });

    // Test 3: Try to read test data
    console.log("📖 Setting up real-time listener...");
    const unsubscribe = onValue(
      testRef,
      (snapshot) => {
        console.log("📨 Received data from Firebase:", snapshot.val());
        setTestData(snapshot.val());
        setConnectionStatus("✅ Read/Write successful - Firebase is working!");
      },
      (error) => {
        console.error("❌ Failed to read data:", error);
        setConnectionStatus(`❌ Read failed: ${error.message}`);
      }
    );

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up Firebase connection test");
      off(testRef);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h4>🔥 Firebase Connection Test</h4>
      <div>Status: {connectionStatus}</div>
      {testData && (
        <div>
          <div>
            Last Test: {new Date(testData.timestamp).toLocaleTimeString()}
          </div>
          <div>Message: {testData.message}</div>
        </div>
      )}
    </div>
  );
};
