import { Router } from "express";
import {faker} from "@faker-js/faker";

const mocksRouter = Router();

mocksRouter.get('/mockingusers', async (req, res) =>{
    try {
        let nombre = faker.person.firstName();
        let apellido = faker.person.lastName();
        let dni = faker.number.int({min:9_500_000, max: 50_000_000});
        let email = faker.internet.email({firstName:nombre, lastName:apellido});
        let users = [];
        let user;

        return user = {
            nombre, 
            apellido, 
            dni,
            email
        };

        users.push(user);
    } catch (error) {
        res.status(500).send({ error: 'Server error mocking users' });
    };
});

mocksRouter.post('/generateData', async (req, res) => { 
    let {cantidad=1} = req.query;
    let data = [];
    try {
        for(let i=0; i<cantidad; i++){
            data.push(generateData());
        };
    
        if(cantidad == 1){
            try {
                data=await modeloDatos.insertMany(data);
            } catch (error) {
                res.setHeader('Content-Type','application/json');
                return res.status(500).json({error:`Error al generar data....`})
            };
        };
    
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({data});
    } catch (error) {
        res.status(500).send({ error: 'Server error generating data' });
    };
});

export default mocksRouter;