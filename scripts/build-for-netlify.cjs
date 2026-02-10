require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const serverUrlPath = path.join(__dirname, "../src/utils/serverUrl.ts");
const apiUrl = process.env.VITE_API_URL_PROD;

if (!apiUrl) {
  console.error("VITE_API_URL_PROD environment variable is required");
  process.exit(1);
}

// Read original file
const originalContent = fs.readFileSync(serverUrlPath, "utf8");

// Create modified content with hardcoded URL
const modifiedContent = `export const serverUrl = () => {
  return "${apiUrl}";
};
`;

try {
  // Write modified file
  fs.writeFileSync(serverUrlPath, modifiedContent);
  console.log(`Replaced serverUrl with: ${apiUrl}`);

  // Run build
  execSync("npm run build", { stdio: "inherit" });
} finally {
  // Always restore original file
  fs.writeFileSync(serverUrlPath, originalContent);
  console.log("Restored original serverUrl.ts");
}
