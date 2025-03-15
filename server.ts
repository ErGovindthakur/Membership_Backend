import app from "./src/app";
import { myConfig } from "./src/config/config";
import connectDb from "./src/config/db";

const startServer = async() => {

  await connectDb();

  const port = myConfig.port || 3000;

  app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
  });
};

startServer();
