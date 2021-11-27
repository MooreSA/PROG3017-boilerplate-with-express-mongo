// drop collection if already exists
db.courses.drop();
// insert new documents into collection
db.courses.insert([
  {
    code: "WEBD3000",
    name: "Web Application Programming II",
  },
  {
    code: "WEBD3027",
    name: "Developing for Content Management Systems",
  },
  {
    code: "INET2005",
    name: "Web Application Programming I",
  },
]);
