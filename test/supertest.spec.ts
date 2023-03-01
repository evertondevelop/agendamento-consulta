import supertest from "supertest";

it('should return a CEP', async () => {
    const { body, status } = await supertest('https://viacep.com.br')
      .get('/ws/01001000/json')

    expect(status).toBe(200)
    expect(body).toEqual({
        "cep": "01001-000",
        "logradouro": "Praça da Sé",
        "complemento": "lado ímpar",
        "bairro": "Sé",
        "localidade": "São Paulo",
        "uf": "SP",
        "ibge": "3550308",
        "gia": "1004",
        "ddd": "11",
        "siafi": "7107"
    })
})