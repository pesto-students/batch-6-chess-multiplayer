import Joi from '@hapi/joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  givenName: {
    type: String,
    maxlength: 50,
  },
  familyName: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 100,
  },
  picture: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const joiSchema = {
    givenName: Joi.string().max(50),
    familyName: Joi.string().max(50),
    name: Joi.string().max(100),
    email: Joi.string().max(50).required()
      .email(),
    picture: Joi.string(),
  };
  return Joi.validate(user, joiSchema);
}
export { validateUser };

export default User;
