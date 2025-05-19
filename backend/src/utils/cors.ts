const whitelist = [
  "http://localhost:3055",
  "http://localhost:5058/api/v1/docs",
];
const options: any = {
  origin: (origin: string, callback: Function) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};

export default options;
