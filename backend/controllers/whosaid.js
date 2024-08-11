const WhoSaids = require("../models/whosaid");

module.exports.saveWhoSaid = async (req, res) => {
  try {
    const { said } = req.body;

    if (!said)
      return res
        .status(400)
        .json({ message: "You cant send an empty saying here" });

    const newWhoSaid = new WhoSaids({ said });

    await newWhoSaid.save();

    return res
      .status(200)
      .json({
        message: "Saying saved Successfully in Who-Said",
        saying: newWhoSaid,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.fetchWhoSaids = async (req, res) => {
  try {
    const sayings = await WhoSaids.find({});
    return res
      .status(200)
      .json({ message: "Fetched Who-Said Successfully", sayings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
