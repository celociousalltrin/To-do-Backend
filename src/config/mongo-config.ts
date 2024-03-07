import { ConnectOptions, connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URI as string);
    if (process.env.NODE_ENV === "development") {
      // console.log("Connected to %s", process.env.DATABASE_URI);
    }
    console.log("App is running ... \n");
    console.log("Press CTRL + C to stop the process. \n");
  } catch (err) {
    if ((err as { message: string }).message) {
      console.error(
        "App starting error:",
        (err as { message: string }).message
      );
    }
    process.exit(1);
  }
};
