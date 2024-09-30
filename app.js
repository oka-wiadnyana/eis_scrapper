const cron = require("node-cron");
const db = require("./db");
const {
  getSkorBulananSemuaKelas,
  getSkorBulanLaluKelas,
  getSkorTahunanWilayahPT,
  getSkorTahunanKelas,
  getSkorBulananKelas,
} = require("./functions");

// cron.schedule("0 0 * * *", async () => {
//   let skorBulananSemuaKelas = await getSkorBulananSemuaKelas();
//   let skorBulananKelas = await getSkorBulananKelas();
//   let skorBulanLaluKelas = await getSkorBulanLaluKelas();
//   let skorTahunanKelas = await getSkorTahunanKelas();
//   let skorTahunanPT = await getSkorTahunanWilayahPT();

//   let allData = {
//     ...skorBulananSemuaKelas,
//     ...skorBulananKelas,
//     ...skorBulanLaluKelas,
//     ...skorTahunanKelas,
//     ...skorTahunanPT,
//   };
//   console.log(allData);
// });

let allData = async () => {
  let skorBulananSemuaKelas = await getSkorBulananSemuaKelas();
  let skorBulananKelas = await getSkorBulananKelas();
  let skorBulanLaluKelas = await getSkorBulanLaluKelas();
  let skorTahunanKelas = await getSkorTahunanKelas();
  let skorTahunanPT = await getSkorTahunanWilayahPT();
  let date = new Date();
  let allData = {
    ...skorBulananSemuaKelas,
    ...skorBulananKelas,
    ...skorBulanLaluKelas,
    ...skorTahunanKelas,
    ...skorTahunanPT,
    created_at: date,
  };
  console.log(allData);

  const scores = [
    skorBulananSemuaKelas,
    skorBulananKelas,
    skorBulanLaluKelas,
    skorTahunanKelas,
    skorTahunanPT,
  ];

  if (scores.every((score) => score === null)) {
    console.log("All values are null.");
  } else {
    // Step 1: Truncate the table
    db.query("TRUNCATE TABLE data_nilai_eis", (err, result) => {
      if (err) {
        console.error("Error truncating the table:", err);
        return;
      }
      console.log("Table truncated successfully");

      // Step 2: Insert new data into the table
      const insertQuery = "INSERT INTO data_nilai_eis SET ?";

      db.query(insertQuery, allData, (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return;
        }
        console.log("Data inserted successfully:", result);

        // Close the db after the operation
        // db.end();
      });
    });
  }
};

// allData();
// Run the cron job every morning and afternoon
cron.schedule("00 07 * * *", async () => {
  allData();
});
cron.schedule("00 16 * * *", async () => {
  allData();
});
