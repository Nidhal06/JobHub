const fs = require("fs");
const path = require("path");

const apiUrl = process.env.API_URL || "";
const dest = path.join(__dirname, "..", "src", "assets", "env.js");

const content = `window.API_URL = "${apiUrl}";`;

try {
  fs.writeFileSync(dest, content, { encoding: "utf8" });
  console.log(`Wrote runtime env to ${dest}`);
} catch (err) {
  console.error("Failed to write runtime env file:", err);
  process.exit(1);
}
