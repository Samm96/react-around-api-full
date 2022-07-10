const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const routes = require("./routes");

const { userLogin, createUser } = require("./controllers/users");
const { celebrate, Joi } = require("celebrate");
const { linkRegex, emailRegex } = require("./utils/regex");

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// temp authorization solution
app.use((req, res, next) => {
  req.user = {
    _id: "62a7e195f4764aa1f59daf17",
  };

  next();
});

app.post("/signin", userLogin);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(linkRegex),
      email: Joi.string().email(emailRegex).required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
