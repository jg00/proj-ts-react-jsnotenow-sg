import express from "express";
import path from "path";
// import fs from "fs/promises";
const fs = require("fs").promises;

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });

      res.send(JSON.parse(result));
    } catch (err) {
      // File does not exists; Error No Entity
      if (err.code === "ENOENT") {
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells from the request obj and serialize them
    // Assumed we are receiving an object with cells property of type an array of cells.
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file.  writeFile() replaces file if exists, creates one if it does not exist.
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
