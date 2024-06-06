$2a$10$aWO1.lnTl4rUcU4GkmlxtOLkYExdxQDomyjIeX.M0wK6goOtlnffq

use("slowyounet");

db.users.updateOne(
  { "username": "torarnehave@gmail.com" },
  { $set: { "password": "f" } }
);
