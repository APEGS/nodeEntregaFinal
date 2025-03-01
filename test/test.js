import { expect } from 'chai';
import supertest from 'supertest';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app.js';
import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';

try {
    await mongoose.connect('mongodb+srv://anna18:9rv542NP0F76hpuj@cluster0.bs1di.mongodb.net/adoptions?retryWrites=true&w=majority&appName=entregaFinal');
} catch (error) {
    console.log('error al acceder a base de datos');
    process.exit();
};

const appTest = supertest("http://localhost:8080");

describe("adoption test", function(){
    this.timeout(7000);

    before(async () => {
        try {
            const newUser = await userModel.create({ 
                first_name: 'Carlos', 
                last_name: 'Test', 
                email: 'ctest@example.com', 
                password: 'passw123'
            });
            // const testNewUser = await request(app).post('/api/users').send(newUser);
            let testNewUserId = newUser.body._id;

            const newPet = await petModel.create({
                name: 'pepe',
                specie: 'dog',
                birthDate: '2017-04-07'
            });
            let testNewPetId = newPet.body._id;

            const newAdoption = await adoptionModel.create({
                owner: testNewUserId,
                pet: testNewPetId
            });
            let testNewAdoptionId = newAdoption._id;
        } catch (error) {
            console.log('new user testing error');
        }
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('debe devolver las adopciones', async () => {
        const res = await request(app).get('/api/adoptions');
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('payload').to.be.an('array');
    });

    it('adoptions/:aid debe devolver una adopción por medio del id', async () => {
        const res = await request(app).get(`/api/adoptions/${testNewAdoptionId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id').equal(testNewAdoptionId.toString());
        expect(res.body).to.have.property('owner').equal(testNewUserId.toString());
        expect(res.body).to.have.property('pet').equal(testNewPetId.toString());
    });

});