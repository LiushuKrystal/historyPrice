function Person() {
  this.name = "KXY";
}
Person.prototype = {
  constructor: Person,
  job: "student",
};

var kxy = new Person();
Object.defineProperty(kxy, "sex", {
  value: "female",
  enumerable: false
});

Object.getOwnPropertyNames(kxy).forEach((item) => {
  console.log(item);
});

for (var pro in kxy) {
  console.log("kxy." + pro + " = " + kxy[pro]);
}