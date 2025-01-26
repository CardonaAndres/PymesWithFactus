import app from "./configs/app.js";
import { PORT } from "./configs/config.js";

app.listen(PORT, '0.0.0.0', () => console.log(`Server RUNNING ON PORT ${PORT}`));