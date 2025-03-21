import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs";

const keyPath = path.join(process.cwd(), "config", "google-service-account.json");
const keyFile = fs.readFileSync(keyPath, "utf8");
const credentials = JSON.parse(keyFile);

const auth = new GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

export default auth;
