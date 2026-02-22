
import { query } from "./config/db";
async function main() {
    const res = await query("SHOW TABLES");
    console.log(res.rows.map(r => Object.values(r)[0]));
}
main();
