const express = require("express");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");
const app = express();

app.get("/pdf/:id", async (request, response) => {
  const id = request.params.id;

  const page = await browser.newPage();
  const url = "http://localhost:5666/users" + id;
  await page.goto(url);
  const pdf = await page.pdf({
    format: "Letter",
  });

  await browser.close();

  response.contentType("application/pdf");

  return response.send(pdf);
});

app.get("/:id", async (request, response) => {
  const id = request.params.id;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  const url = "http://localhost:5666/users" + id;
  await page.goto(url);
  await page.content();
  const data = await page.evaluate(() => {
    return JSON.parse(document.querySelector("body").innerText);
  });
  await browser.close();
  const filePath = path.join(__dirname);
  console.log(data);
  ejs.renderFile(
    filePath,
    {
      data,
    },
    async (err, html) => {
      if (err) {
        return res.send("Erro na leitura do arquivo" + console.log(err));
      }
      return await res.send(html);
    }
  );
});
ejs.renderFile(filePath, { passengers }, (err, html) => {
  if (err) {
    return response.send("Erro na leitura do arquivo");
  }

  return response.send(html);
});

app.listen(5000);
