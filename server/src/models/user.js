import Joi from '@hapi/joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  givenName: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  familyName: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 100,
  },
  picture: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const joiSchema = {
    givenName: Joi.string().min(2).max(50),
    familyName: Joi.string().min(2).max(50),
    name: Joi.string().min(2).max(100),
    email: Joi.string().min(5).max(50).required()
      .email(),
    picture: Joi.string(),
  };
  return Joi.validate(user, joiSchema);
}
export { validateUser };

export default User;
