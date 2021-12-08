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
  {
    code: "PROG2700",
    name: "Client Side Programming",
  },
  {
    code: "PROG3017",
    name: "Full Stack Programming",
  },
  {
    code: "WEBD1000",
    name: "Website Development",
  },
  {
    code: "APPD1001",
    name: "User Interface Design & Development",
  },
  {
    code: "PROG1700",
    name: "Logic and Programming",
  },
]);
