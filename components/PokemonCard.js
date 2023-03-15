app.component('pokemon-card',{
    template:
    /*html*/
    `
    <div id="grid-container" v-if="show">
        <div v-for="(pokemon, index) in pokedex" id="card" :class="{'card-flip': showMore[index]}">
                <div class="side front-side-card" :class="{[pokemon.types[0].type.name + '-bgcolor']: true}" v-if="!hideFrontFace[index]">
                    <p class="pokemon-id" v-if="pokemon.id < 10">#00{{ pokemon.id }}</p>
                    <p v-if="pokemon.id >= 10 && pokemon.id <= 99">#0{{ pokemon.id }}</p>
                    <p v-else-if="pokemon.id > 99">#{{ pokemon.id }}</p>
                        
                    <img id="img-pokemon" :src="pokemon.img">
                    <!-- .normalize is used to delete the accents -->
                    <p>{{ pokemon.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") }}</p>
                    <div class="pokemon-types"><p v-for="type in pokemon.types" ><div :class="{[type.type.name]: true}">{{ type.type.name }}</div></p></div>
                    <button class="show-more-button" @click="showMoreInfosUpdate(index)"><i class="fa-solid fa-arrow-right"></i></button>         
                </div>
                <div class="side back-side-card" :class="{[pokemon.types[0].type.name + '-bgcolor']: true}">
                    <p :style="{'font-weight': 'bold'}">{{ pokemon.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") }}</p>
                    <button class="show-more-button" @click="showMoreInfosUpdate(index)"><i class="fa-solid fa-arrow-right"></i></button>
                    <div class="grid-sprites">
                        <img class="img-sprite"  :src="pokemon.front_sprite">
                        <img  class="img-sprite" :src="pokemon.back_sprite">
                        <img  class="img-sprite" :src="pokemon.front_shiny">
                        <img  class="img-sprite" :src="pokemon.back_shiny">
                    </div>
                    <br/>
                    <p :style="{'text-align': 'left', margin: '5px'}">Description : </p>
                    <p>{{ pokemon.description.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  }}</p>
                    <br />
                    <p>Poids : {{ pokemon.weight }} kg & Taille : {{ pokemon.height }} m</p>
                </div>
        </div>
    </div>

    <div>
        <button class="loadMore" v-if="pokedex.length < 151" @click="get50Pokemons"><i class="fa-sharp fa-solid fa-angle-down"></i></button>
    </div>

    `,
    data(){
        return{
            pokedex: [],
            show: true,
            nb_pokemons_to_load: 0,
            nb_pokemons_loaded: 0,
            showMore: [],
            hideFrontFace: []
        }      
    },
    methods:{
        async get50Pokemons() {
            this.nb_pokemons_to_load += this.nb_pokemons_to_load < 125 ? 25:26;
            for (let i = this.nb_pokemons_loaded+1; i <= this.nb_pokemons_to_load; i++) {

                const response = await P.getPokemonSpeciesByName(i);
                const response2 = await P.getPokemonByName(response.id);
                const response3 = await P.getPokemonSpeciesByName(response.id);
                const pokemon = {id: response.id, 
                    name: response.names[4].name, 
                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/'+response.id+'.svg',
                    types: response2.types,
                    height: response2.height / 10,
                    weight: response2.weight / 10,
                    front_sprite: response2.sprites.front_default,
                    back_sprite: response2.sprites.back_default,
                    front_shiny: response2.sprites.front_shiny,
                    back_shiny: response2.sprites.back_shiny,
                    description: response3.flavor_text_entries[16].flavor_text
                };
                this.pokedex.push(pokemon);
                this.showMore.push(false);
                this.hideFrontFace.push(false);

            }
            this.nb_pokemons_loaded = this.nb_pokemons_to_load
        },
        showMoreInfosUpdate(index){ 
                this.showMore[index] = !(this.showMore[index]);
                console.log(this.hideFrontFace[index])
                setTimeout(() => {
                    this.hideFrontFace[index] = !(this.hideFrontFace[index]);
                  }, 270);
        },
    },
    created(){
        this.get50Pokemons();
    },
})