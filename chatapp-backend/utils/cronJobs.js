const cron = require("node-cron");
const messagemodel = require("../models/messagemodel");

// ⏰ Every 5 minutes
cron.schedule("*/1 * * * *", async () => {
  try {
    const result = await messagemodel.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} messages at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error("❌ Failed to delete messages:", error.message);
  }
});
