const apiUrl: string = (import.meta as any).env.DEV
  ? "http://localhost:5000/api/v1"
  : "https://rcalms-backend.onrender.com/api/v1";

export { apiUrl };
