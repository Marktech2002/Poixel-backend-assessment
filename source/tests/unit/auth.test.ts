import { createJWT ,hashPassword , comparePassword } from '../../utils/auth';
import jwt from 'jsonwebtoken';

import { Types } from 'mongoose';

interface User {
  _id: string; 
  email: string;
};

describe('Test the JWT create function', () => {
  it('should return the payload after decoding the token', async () => {
    const payload: User = { _id: new Types.ObjectId().toHexString(), email: 'yaqub@example.com' }; 
    const token = createJWT(payload);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    expect(decoded).toMatchObject(payload); // Expect the decoded token to match the original payload
  });
});

describe('Test the Hash Password function', ()=> {
    it ('should return a hashed password that does not match the original password' , async ()=> {
      const password : string = 'Tawab@1234';
      const hashedpassword = hashPassword(password);
      expect(hashedpassword).toBeDefined(); // The hashed password should be defined
      expect(hashedpassword).not.toBe(password); // The hashed password should not match the plain text password
    })
});

describe('Test the Compare Password function', ()=> {
  it ('should return true when the password matches the hashed password' , async ()=> {
    const password : string = 'Tawab@1234';
    const hashedpassword  = await hashPassword(password);
    
    const passwordMatch = comparePassword(password , hashedpassword);// Compare the original password with the hash
    expect(passwordMatch).toBeTruthy(); // Expect the comparison to return true
  });

  it ('should return false when password is different from hashed password' ,  async ()=> {
    const password : string = 'Tawab@1234';
    const hashedpassword =  await hashPassword(password);
    
    const passwordMatch = await comparePassword('Tawab@1097', hashedpassword);// Compare a different password with the hash
    expect(passwordMatch).toBeFalsy(); // Expect the comparison to return false
  })
});
