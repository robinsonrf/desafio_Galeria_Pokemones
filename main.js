const axios = require('axios');
const http = require('http');
const fs = require('fs');
const port = 3000;
const nameArray = [];
const nameAndImg = [];

//1. Hacer uso de Async/Await para las funciones que consulten los endpoints de la pokeapi.
async function getPokemon() {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150`);
    let listPoke = data.results;
    return listPoke;
}

async function getDatos(name) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    let pokemones = data
    return pokemones;
}

getPokemon().then((nombres) => {
    nombres.forEach((e) => {
        let namePoke = e.name
        nameArray.push(getDatos(namePoke))
    })

    //2. Usar el Promise.all() para ejecutar y obtener la data de las funciones asíncronas
    //generando un nuevo arreglo con la data a entregar en el siguiente requerimiento.

    Promise.all(nameArray).then((results) => {
        results.forEach((e) => {
            //console.log(`Nombre: ${e.name}\nImg: ${e.sprites.back_shiny}`)
            nameAndImg.push({ nombre: e.name, img: e.sprites.back_shiny});
        })
    })
})

//Disponibilizar la ruta http://localhost:3000/pokemones que devuelva un JSON con el
//nombre y la url de una imagen de 150 pokemones, asi como verás en la siguiente

http.createServer((req, res) => {

    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('index.html', 'utf8', (err, html) => {
            res.end(html)
        })
    }

    if (req.url == '/pokemones') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        fs.writeFile('pokemones.json', JSON.stringify(nameAndImg), (err, json)=>{
            res.end(json);
            console.log("Archivo JSON CREADO CON EXITO");
        })
        res.write(JSON.stringify(nameAndImg))
        res.end();
    }
}).listen(port, () => console.log(`escuchando el puerto ${port}`))