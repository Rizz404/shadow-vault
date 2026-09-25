import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function indexKnowledge() {
  try {
    // Kita ambil kutipan inspiratif/teknis
    // (api.quotable.io sudah mati: sertifikat HTTPS-nya expired)
    const response = await axios.get("https://dummyjson.com/quotes/random", {
      timeout: 10000,
    });
    const { quote: content, author } = response.data;

    const vaultDir = path.join(__dirname, "vault");
    if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir);

    const today = new Date().toISOString().split("T")[0];
    const filePath = path.join(vaultDir, `${today}.md`);

    const entry = `\n> "${content}"\n> — **${author}**\n\n*Captured at: ${new Date().toLocaleString()}*\n\n---`;

    // Jika file sudah ada, kita append (tambah di bawahnya)
    fs.appendFileSync(filePath, entry);

    console.log(`✅ Shadow-Vault: New wisdom indexed for ${today}!`);
  } catch (error) {
    console.error("❌ Error capturing wisdom:", error);
    // Biar step di workflow gagal dengan jelas, bukan diam-diam sukses
    process.exit(1);
  }
}

indexKnowledge();
