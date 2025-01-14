import express from "express";
import mongoose from "mongoose";
import getSchedule from "./database/fetchAuditories.js";
import cors from "cors";

import ScheduleModel from "./models/schedules.js";

mongoose
  .connect(
    "mongodb+srv://jzndjxjcbd:Deadpool23923.@cluster0.6ofd9.mongodb.net/schedules"
  )
  .then(async () => {
    console.log("DB ok");
    const count = await mongoose.connection.db
      .collection("schedules")
      .countDocuments();
    if (count == 0) {
      let data = await getSchedule();
      let schedulePromise = [];
      for (let key in data) {
        const doc = new ScheduleModel({
          name: `${key}`,
          content: data[key],
        });
        schedulePromise.push(await doc.save());
      }
      await Promise.all(schedulePromise).then((values) => {
        // console.log(values);
      });
    }
  })
  .catch((err) => console.log("DB errro", err));

const app = express();

app.use(express.json());
app.use(cors());

app.get("/auditories/:name", async (req, res) => {
  try {
    const scheduleName = req.params.name;

    const schedule = await ScheduleModel.findOne({
      name: scheduleName,
    });
    if (schedule == null) {
      res.status(404).json({
        message: "Не удалось найти расписание",
      });
    } else {
      res.json(schedule);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при запросе",
    });
  }
});

app.get("/auditories", async (req, res) => {
  const auditories = await ScheduleModel.find({}, "name");

  const auditoriesList = auditories.map((auditorie) => auditorie.name);

  res.json(auditoriesList);
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});
