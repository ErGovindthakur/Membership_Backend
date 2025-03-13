import app from "./src/app";
import { myConfig } from "./src/config/config";

const startServer = () => {
  const port = myConfig.port || 3000;

  app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
  });
};

startServer();
