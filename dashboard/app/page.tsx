"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then(r => r.json())
      .then(d => setStatus(d.status))
      .catch(() => setStatus("API offline"));
  }, []);

  return <h1>{status}</h1>;
}
