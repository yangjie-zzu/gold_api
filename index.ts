import './task';
import {app} from './api';

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});