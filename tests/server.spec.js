const request = require("supertest");
const server = require("../index");
const { default: test } = require("node:test");

describe("Operaciones CRUD de cafes", () => {
    test("La ruta GET cafes devuelve un status code 200 y un array de al menos un objeto", async () => {
        const response = await request(server).get("/cafes");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("La ruta delete de cafes devuelve un status code 404, si el id no existe", async () => {
        const idDoesNotExist = 999; // id que no esta en el json de cafes
        const response = await request(server)
        .delete(`/cafes/${idDoesNotExist}`)
        .set("Authorization", "Bearer Token");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No se ha encontrado ningún café con ese id");
    });

    test("La ruta post de cafes agrega un nuevo cafe y devuelve codigo 201", async () => {
        const newCoffee = { id: 5, nombre: "Latte"};
        const response = await request(server).post("/cafes").send(newCoffee);
        expect(response.status).toBe(201);
        expect(response.body).toContainEqual(newCoffee);
    });

    test("La ruta put de cafes devuelve un codigo 400 si el id del parametro y el id del payload no coinciden", async () => {
        const updatedCoffee = { id: 5, nombre: "Espresso"};
        const idDoesNotMatch = 6;
        const response = await request(server).put(`/cafes/${idDoesNotMatch}`).send(updatedCoffee);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
    });
});
