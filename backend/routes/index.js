const giftRoutes = require("./gifts");
const testRoutes = require("./test");

const constructorMethod = (app) => {
  app.use("/test", testRoutes);

  app.use("/gifts", giftRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
