app.component("search-bar",{
    template:
    /*html*/
    `
    <div id="container-header">
        <div id="search-area">
            <form>
                <label class="form-label">Search Pokemon by Name (in English)</label>
                <br />
                <input id="search-input" type="search" ref="pokename" placeholder="ex : Charizard" required>
                <button class="button-search-area" type="submit"  value=" " @click="show = true" @click.prevent="getPokemonWithName"><i class="fa-solid fa-magnifying-glass"></i></button>
                <button class="button-search-area" type="reset" @click="show = false"><i class="fa-solid fa-xmark"></i></button>
            </form>

       </div>
    </div>

    
    <p class="text-error" v-if="pokedex.length == 0 && show">ERROR : No Pokemon Found</p>
    <div v-if="show" v-for="(pokemon, index) in pokedex" id="card" :class="{'card-flip': showMore[index]}">
                <div class="side front-side-card" :class="{[pokemon.types[0].type.name + '-bgcolor']: true}" v-if="!hideFrontFace[index]">
                    <p v-if="pokemon.id < 10">#00{{ pokemon.id }}</p>
                    <p v-if="pokemon.id > 10 && pokemon.id < 99">#0{{ pokemon.id }}</p>
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

    <pokemon-card v-if="!show"></pokemon-card>
    `,
    data(){
        return{
            pokedex: [],
            show: false,
            showMore: [],
            hideFrontFace: []
        }
    },
    methods:{
        async getPokemonWithName() {
            this.pokedex = [];
            pokename = this.$refs.pokename.value.toLowerCase();
            try{
                const answer = await P.getPokemonByName(pokename);
                const answer2 = await P.getPokemonSpeciesByName(answer.id);
                const pokemon = {id: answer.id, 
                    name: answer.name, 
                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/'+answer.id+'.svg',
                    types: answer.types,
                    height: answer.height / 10,
                    weight: answer.weight / 10,
                    front_sprite: answer.sprites.front_default,
                    back_sprite: answer.sprites.back_default,
                    front_shiny: answer.sprites.front_shiny,
                    back_shiny: answer.sprites.back_shiny,
                    description: answer2.flavor_text_entries[16].flavor_text};
                this.pokedex.push(pokemon);
                this.showMore.push(false);
                this.hideFrontFace.push(false);
            }
            catch{
                console.log("This pokemon doesn't exist ! ")
            }
        },
        showMoreInfosUpdate(index){ 
                this.showMore[index] = !(this.showMore[index]);
                setTimeout(() => {
                    this.hideFrontFace[index] = !(this.hideFrontFace[index]);
                  }, 270);
        },
    },
})