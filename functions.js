const puppeteer = require("puppeteer");
const moment = require("moment");
require("dotenv").config();

const eisUrl = process.env.EIS_URL;
const seluruhPT = process.env.SELURUH_PT;
const pt = process.env.PT;
const seluruhKelas = process.env.SELURUH_KELAS;
const kelas = process.env.KELAS;
const seluruhKategori = process.env.SELURUH_KATEGORI;
const kategori = process.env.KATEGORI;
const PN = process.env.PN;

const vwHeight = 1080;
const vwWidth = 1920;

// let month = moment().format("MM");
// let lastMonth = moment().subtract(1, "month").format("MM");

// let year = moment().format("YYYY");

let getSkorBulananSemuaKelas = async () => {
  let month = moment().format("MM");

  let year = moment().format("YYYY");

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: vwWidth, height: vwHeight });
  console.log(month, year);

  try {
    await page.goto(eisUrl, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    await page.waitForSelector("#TabelData_wrapper", {
      visible: true,
    });
    await page.select("#pengadilan_tinggi", seluruhPT);

    await page.select("#bulan_awal", month);
    await page.select("#tahun_awal", year);
    await page.select("#bulan_akhir", month);
    await page.select("#tahun_akhir", year);

    const [button] = await page.$x(`//button[contains(., 'cari')]`);

    if (button) {
      await button.click();
    }
    // return;

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let result = {
      peringkat_bulanan_semua_kelas: null,
      persentase_bulanan_semua_kelas: null,
      skor_bulanan_semua_kelas: null,
    };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const persentase = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );
      const nilai = await row.$eval(
        "td:nth-child(9) div small",
        (element) => element.textContent
      );

      if (pn === PN) {
        result = {
          peringkat_bulanan_semua_kelas: i + 1,
          persentase_bulanan_semua_kelas: persentase,
          skor_bulanan_semua_kelas: nilai,
        };
        break;
      }
    }
    await browser.close();
    return result;
  } catch (error) {
    let result = {
      peringkat_bulanan_semua_kelas: null,
      persentase_bulanan_semua_kelas: null,
      skor_bulanan_semua_kelas: null,
    };
    await browser.close();
    return result;
  }
};
let getSkorBulananKelas = async () => {
  let month = moment().format("MM");

  let year = moment().format("YYYY");

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: vwWidth, height: vwHeight });
  console.log(month, year);

  try {
    await page.goto(eisUrl, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    await page.waitForSelector("#TabelData_wrapper", {
      visible: true,
    });
    await page.select("#pengadilan_tinggi", seluruhPT);
    await page.select("#kategori", kategori);
    await page.select("#kelas", kelas);

    await page.select("#bulan_awal", month);
    await page.select("#tahun_awal", year);
    await page.select("#bulan_akhir", month);
    await page.select("#tahun_akhir", year);

    const [button] = await page.$x(`//button[contains(., 'cari')]`);

    if (button) {
      await button.click();
    }
    // return;

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let result = {
      peringkat_bulanan_kelas: null,
      persentase_bulanan_kelas: null,
      skor_bulanan_kelas: null,
    };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const persentase = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );
      const nilai = await row.$eval(
        "td:nth-child(9) div small",
        (element) => element.textContent
      );

      if (pn === PN) {
        result = {
          peringkat_bulanan_kelas: i + 1,
          persentase_bulanan_kelas: persentase,
          skor_bulanan_kelas: nilai,
        };
        break;
      }
    }
    await browser.close();
    return result;
  } catch (error) {
    let result = {
      peringkat_bulanan_kelas: null,
      persentase_bulanan_kelas: null,
      skor_bulanan_kelas: null,
    };
    await browser.close();
    return result;
  }
};

let getSkorBulanLaluKelas = async () => {
  let month = moment().format("MM");
  let lastMonth = moment().subtract(1, "month").format("MM");

  let year = moment().format("YYYY");
  if (month == "01") {
    lastMonth = "12";
    year = moment().subtract(1, "year").format("YYYY");
  } else {
    lastMonth = moment().subtract(1, "month").format("MM");
    year = moment().format("YYYY");
  }
  console.log(month, lastMonth, year);
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: vwWidth, height: vwHeight });

  try {
    await page.goto(eisUrl, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector("#TabelData_wrapper", {
      visible: true,
    });
    await page.select("#pengadilan_tinggi", seluruhPT);
    await page.select("#kategori", kategori);
    await page.select("#kelas", kelas);

    await page.select("#bulan_awal", lastMonth);
    await page.select("#tahun_awal", year);
    await page.select("#bulan_akhir", lastMonth);
    await page.select("#tahun_akhir", year);

    const [button] = await page.$x("//button[contains(., 'cari')]");
    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");

    let result = {
      peringkat_bulan_lalu_kelas: null,
      persentase_bulan_lalu_kelas: null,
      skor_bulan_lalu_kelas: null,
    };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );
      const persentase = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );
      const nilai = await row.$eval(
        "td:nth-child(9) div small",
        (element) => element.textContent
      );

      if (pn === PN) {
        result = {
          peringkat_bulan_lalu_kelas: i + 1,
          persentase_bulan_lalu_kelas: persentase,
          skor_bulan_lalu_kelas: nilai,
        };
        break;
      }
    }
    await browser.close();
    return result;
  } catch (error) {
    let result = {
      peringkat_bulan_lalu_kelas: null,
      persentase_bulan_lalu_kelas: null,
      skor_bulan_lalu_kelas: null,
    };
    await browser.close();
    return result;
  }
};

let getSkorTahunanWilayahPT = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: vwWidth, height: vwHeight });
  try {
    await page.goto(eisUrl, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector("#TabelData_wrapper", {
      visible: true,
    });
    await page.select("#pengadilan_tinggi", pt);
    // await page.select("#kelas", kelas);

    const [button] = await page.$x(`//button[contains(., 'cari')]`);

    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");
    let result = {
      peringkat_tahunan_pt: null,
      persentase_tahunan_pt: null,
      skor_tahunan_pt: null,
    };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );
      const persentase = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );
      const nilai = await row.$eval(
        "td:nth-child(9) div small",
        (element) => element.textContent
      );

      if (pn === PN) {
        result = {
          peringkat_tahunan_pt: i + 1,
          persentase_tahunan_pt: persentase,
          skor_tahunan_pt: nilai,
        };
        break;
      }
    }

    await browser.close();
    return result;
  } catch (error) {
    let result = {
      peringkat_tahunan_pt: null,
      persentase_tahunan_pt: null,
      skor_tahunan_pt: null,
    };
    await browser.close();
    return result;
  }
};

let getSkorTahunanKelas = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: vwWidth, height: vwHeight });
  try {
    await page.goto(eisUrl, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector("#TabelData_wrapper", {
      visible: true,
    });
    await page.select("#pengadilan_tinggi", seluruhPT);
    await page.select("#kelas", kelas);

    const [button] = await page.$x(`//button[contains(., 'cari')]`);

    if (button) {
      await button.click();
    }

    await new Promise((r) => setTimeout(r, 5000));

    const rows = await page.$$("#TabelData tbody tr");
    let result = {
      peringkat_tahunan_kelas: null,
      persentase_tahunan_kelas: null,
      skor_tahunan_kelas: null,
    };
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );
      const persentase = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );
      const nilai = await row.$eval(
        "td:nth-child(9) div small",
        (element) => element.textContent
      );

      if (pn === PN) {
        result = {
          peringkat_tahunan_kelas: i + 1,
          persentase_tahunan_kelas: persentase,
          skor_tahunan_kelas: nilai,
        };
        break;
      }
    }

    await browser.close();
    return result;
  } catch (error) {
    let result = {
      peringkat_tahunan_kelas: null,
      persentase_tahunan_kelas: null,
      skor_tahunan_kelas: null,
    };
    await browser.close();
    return result;
  }
};

// getSkorBulananKelas().then((res) => {
//   console.log(res);
// });

module.exports = {
  getSkorBulananSemuaKelas,
  getSkorBulananKelas,
  getSkorBulanLaluKelas,
  getSkorTahunanWilayahPT,
  getSkorTahunanKelas,
};
