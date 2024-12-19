"use server";

import axios from "axios";
import { loginSchema, LoginValues } from "@/lib/validation";
import { redirect } from "next/navigation";

export async function login(credentials: LoginValues): Promise<{ error?: string }> {
  try {
    // Validate the incoming credentials using the schema
    const { username, password } = loginSchema.parse(credentials);

    // Make a POST request to the backend API for login
    const response = await axios({
      url: "http://localhost:8000/api/login/",
      method: "POST",
      withCredentials: true, // Ensures cookies are sent and received
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
      },
    });

    console.log("Login response:", response.data);

    // Redirect to home or other page upon successful login
    redirect("/home");
    return {};
  } catch (error: any) {
    console.error("Login error:", error);

    // Return an error object for the UI to handle
    return {
      error: error.response?.data?.message || "An error occurred",
    };
  }
}