const envVars = ["MONGO_URI", "JWT_SECRET", "JWT_LIFETIME"];

envVars.map((key) => {
  if (process.env[key] === undefined) {
    throw new Error(`"${key}" environment variable is not defined`);
  }
});
