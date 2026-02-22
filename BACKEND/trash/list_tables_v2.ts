
import { query } from "./config/db";
async function main() {
    const res = await query("SHOW TABLES");
    res.rows.forEach(r => console.log(Object.values(r)[0]));
}
main();
