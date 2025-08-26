const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WebpageStorageModule", (m) => {
  // We don't need any parameters for WebpageStorage, but you can add them if needed
  // const someParameter = m.getParameter("someParameter", defaultValue);

  const webpageStorage = m.contract("WebpageStorage");

  // Remove or comment out the following line if onDeploy is not defined
  // webpageStorage.onDeploy(...);

  // You can add post-deployment actions here if needed
  // m.afterDeploy(async (_, { WebpageStorage }) => {
  // });

  return { webpageStorage };
});
