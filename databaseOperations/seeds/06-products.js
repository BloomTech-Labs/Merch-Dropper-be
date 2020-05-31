exports.seed = function(knex) {
  return knex("products").insert([
    {
      productName: "Test Product - Store One",
      color: "white",
      size: "med",
      type: "dtg",
      designId: "1",
      fullSizeURL:
        "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
      thumbnailURL:
        "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
      price: 10.3,
      storeID: 1
    },
    {
      productName: "Test Product - Store 2",
      color: "black",
      size: "med",
      type: "dtg",
      designId: "1",
      fullSizeURL:
        "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
      thumbnailURL:
        "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
      price: 22.3,
      storeID: 2
    }
  ]);
};
